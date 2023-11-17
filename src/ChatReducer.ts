/* eslint-disable default-param-last */
import {
	GET_MESSAGES,
	RECEIVE_MESSAGES,
	SEND_MESSAGE,
	MESSAGE_SENT,
	INIT,
} from "./ActionTypes";

import { Message } from './Actions';

export interface GetMessagesAction {
  type: typeof GET_MESSAGES;
}

export interface ReceiveMessagesAction {
  type: typeof RECEIVE_MESSAGES;
  payload: Message[];
}

export interface SendMessageAction {
  type: typeof SEND_MESSAGE;
  payload: Message;
}

export interface MessageSentAction {
  type: typeof MESSAGE_SENT;
  payload: Message;
}

export interface InitAction {
  type: typeof INIT;
}

export type ChatActionTypes =
  | GetMessagesAction
  | ReceiveMessagesAction
  | SendMessageAction
  | MessageSentAction
  | InitAction;

export interface ChatState {
  messages: Message[];
  isFetching: boolean;
}

export const initialState: ChatState = {
	messages: [],
	isFetching: false,
};

const chatReducer = (
	state: ChatState = initialState,
	action: ChatActionTypes
): ChatState => {
	switch (action.type) {
	case INIT:
		return initialState;
	case GET_MESSAGES:
		return {
			...state,
			isFetching: true,
		};
	case RECEIVE_MESSAGES:
		return {
			...state,
			messages: action.payload,
			isFetching: false,
		};
	case SEND_MESSAGE:
		return state;
	case MESSAGE_SENT:
		return state;
	default:
		return state;
	}
};

export default chatReducer;
