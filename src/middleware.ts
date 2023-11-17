import { ChatActionTypes } from './ChatReducer';
import { sendMessage, getMessagesList } from './chat';

interface Store<S, A> {
    getState: () => S;
    dispatch: (action: A) => void;
}

type Action = ChatActionTypes;

function chatMiddleware<S>(store: Store<S, Action>) {
    return function (next: (action: Action) => void) {
        return function (action: Action) {
            switch (action.type) {
                case 'SEND_MESSAGE':
                    sendMessage(action.payload).then(() => {
                        store.dispatch({ type: 'MESSAGE_SENT', payload: action.payload });
                    }).catch((error) => {
                        console.error('Ошибка отправки сообщения', error);
                    });
                    break;
                case 'GET_MESSAGES':
                    getMessagesList().then((messages) => {
                        store.dispatch({ type: 'RECEIVE_MESSAGES', payload: messages });
                    }).catch((error) => {
                        console.error('Ошибка получения сообщений', error);
                    });
                    break;
                default:
                    next(action);
                    break;
            }
        };
    };
}

