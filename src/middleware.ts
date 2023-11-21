import { ChatActionTypes } from "./ChatReducer";
import { sendMessage, getMessagesList, observeWithEventSource, deleteMessageId } from "./chat";
import { Store } from "./ChatStore";
import { EventData, receiveNewMessage, deleteMessage, updateMessages, getMessages } from "./Actions";


type Action = ChatActionTypes;
let isEventSourceInitialized = false;

export function chatMiddleware<S>(store: Store) {
	return function middlewareNext(next: (action: Action) => void) {
		return function middlewareAction(action: Action) {
			console.log('Middleware action:', action);
			switch (action.type) {
				case "SEND_MESSAGE":
					sendMessage(action.payload)
						.then(() => {
							store.dispatch({ type: "MESSAGE_SENT", payload: action.payload });
							store.dispatch(receiveNewMessage(action.payload));
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
							console.log("Message deleted successfully");
							store.dispatch(deleteMessage(action.payload));
							store.dispatch(getMessages());
						})
						.catch((error) => {
							console.error("Ошибка удаления сообщения", error);
						});
					break;
				case "UPDATE_MESSAGES":
					if (!isEventSourceInitialized) {
						observeWithEventSource((eventData: EventData) => {
							if (eventData && eventData.data) {
								const messages = Object.values(eventData.data);
								messages.forEach(message => {
									store.dispatch(deleteMessage(message.id));
									store.dispatch(receiveNewMessage(message));
									
								});
								store.dispatch(updateMessages(messages));
								store.dispatch(getMessages());

							}
						});
						isEventSourceInitialized = true;
					}
					break;
				default:
					next(action);
					break;
			}
		};
	};
}
