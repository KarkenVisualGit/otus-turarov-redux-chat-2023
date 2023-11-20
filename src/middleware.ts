import { ChatActionTypes } from "./ChatReducer";
import { sendMessage, getMessagesList, observeWithEventSource, observeWithXHR } from "./chat";
import { Store } from "./ChatStore";
import { EventData, receiveNewMessage } from "./Actions";


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
					if (!isEventSourceInitialized) {
						observeWithEventSource((eventData: EventData) => {
							console.log("Dispatching RECIEVE_NEW_MESSAGE action:", eventData);
							if (eventData && eventData.data) {
								const messages = Object.values(eventData.data);
								messages.forEach(message => {
									store.dispatch(receiveNewMessage(message));
								});
							}
						});
						isEventSourceInitialized = true;
					}
					getMessagesList()
						.then((messages) => {
							store.dispatch({ type: "RECEIVE_MESSAGES", payload: messages });
						})
						.catch((error) => {
							console.error("Ошибка получения сообщений", error);
						});
					break;
				default:
					next(action);
					break;
			}
		};
	};
}
