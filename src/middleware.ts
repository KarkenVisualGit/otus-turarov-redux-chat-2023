import { ChatActionTypes } from "./ChatReducer";
import {
	sendMessage,
	getMessagesList,
	observeWithEventSource,
	deleteMessageId,
	EventDataRec,
} from "./chat";
import { Store } from "./ChatStore";
import {
	EventData,
	receiveNewMessage,
	deleteMessage,
	updateMessages,
	getMessages,
	Message
} from "./Actions";


type Action = ChatActionTypes;


export function chatMiddleware<S>(store: Store) {
	return function middlewareNext(next: (action: Action) => void) {
		return function middlewareAction(action: Action) {
			console.log('Middleware action:', action);
			switch (action.type) {
				case "SEND_MESSAGE":
					sendMessage(action.payload)
						.then(() => {
							store.dispatch({ type: "MESSAGE_SENT", payload: action.payload });
							store.dispatch(getMessages());
						})
						.catch((error) => {
							console.error("Ошибка отправки сообщения", error);
						});
					break;
				case "GET_MESSAGES":
					getMessagesList()
						.then((messages) => {
							store.dispatch({ type: "RECEIVE_MESSAGES", payload: messages });
						})
						.catch((error) => {
							console.error("Ошибка получения сообщений", error);
						});
					break;
				case "DELETE_MESSAGE":
					deleteMessageId(action.payload)
						.then(() => {
							console.log('Middleware action:', action);
							store.dispatch({ type: "MESSAGE_DELETED", payload: action.payload });
							console.log("Message with action.payload deleted successfully " + action.payload);
						})
						.catch((error) => {
							console.error("Ошибка удаления сообщения", error);
						});
					break;
				case "UPDATE_MESSAGES":
					console.log("Initializing event source for message updates");
					observeWithEventSource((eventData: EventDataRec | Message) => {
						if (eventData) {
							if (eventData && 'id' in eventData) {
								const message = {
									...eventData as Message,
									date: new Date((eventData as Message).date)
								};

								store.dispatch({
									type: 'RECEIVE_NEW_MESSAGE',
									payload: message
								});
							}
							else if (typeof eventData === 'object') {
								const messages = Object.values(eventData).map(item => {
									if (typeof item === 'object' && item && 'id' in item) {
										return {
											...item as Message,
											date: new Date((item as Message).date)
										};
									}
									return item;
								}) as Message[];
								messages.forEach((message: Message) => {
									store.dispatch({
										type: 'RECEIVE_NEW_MESSAGE',
										payload: message
									});
								});
							}
						}

					});

					break;

				default:
					next(action);
					break;
			}
		};
	};
}
