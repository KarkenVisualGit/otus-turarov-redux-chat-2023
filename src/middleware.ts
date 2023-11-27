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
					if (!isEventSourceInitialized) {
						console.log("Initializing event source for message updates");
						observeWithEventSource((eventData: EventData) => {
							if (eventData && eventData.data) {
								console.log("Message updated successfully");
								const messages = Object.values(eventData.data);
								messages.forEach(message => {
									store.dispatch(receiveNewMessage(message));
								});
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
