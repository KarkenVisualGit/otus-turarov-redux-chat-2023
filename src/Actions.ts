import {
	GET_MESSAGES,
	RECEIVE_MESSAGES,
	SEND_MESSAGE,
	MESSAGE_SENT,
	RECEIVE_NEW_MESSAGE
} from "./ActionTypes";

import { SendMessageAction, GetMessagesAction, ReceiveNewMessageAction } from './ChatReducer'

export interface Message {
	nickname: string;
	message: string;
	date?: Date;
}

export interface EventData {
	data: Message;
}

export const getMessages = ():GetMessagesAction => ({
	type: GET_MESSAGES,
});

export const receiveMessages = (messages: Message[]) => ({
	type: RECEIVE_MESSAGES,
	payload: messages,
});

export const sendMessages = (message: Message): SendMessageAction => ({
	type: SEND_MESSAGE,
	payload: message,
});

export const messageSent = (message: Message) => ({
	type: MESSAGE_SENT,
	payload: message,
});

export const receiveNewMessage = (message: Message): ReceiveNewMessageAction => ({
	type: RECEIVE_NEW_MESSAGE,
	payload: message,
  });