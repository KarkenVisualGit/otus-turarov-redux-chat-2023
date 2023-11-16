import { GET_MESSAGES, RECEIVE_MESSAGES, SEND_MESSAGE, MESSAGE_SENT } from './ActionTypes';


interface Message {
    nickname: string;
    message: string;
    date?: Date;
}

export const getMessages = () => ({
    type: GET_MESSAGES,
});

export const receiveMessages = (messages: Message[]) => ({
    type: RECEIVE_MESSAGES,
    payload: messages,
});

export const sendMessage = (message: Message) => ({
    type: SEND_MESSAGE,
    payload: message,
});

export const messageSent = (message: Message) => ({
    type: MESSAGE_SENT,
    payload: message,
});
