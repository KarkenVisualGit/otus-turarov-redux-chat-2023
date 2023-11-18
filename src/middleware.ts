import { ChatActionTypes } from "./ChatReducer";
import { sendMessage, getMessagesList } from "./chat";
import { Store } from "./ChatStore";


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
			default:
				next(action);
				break;
			}
		};
	};
}
