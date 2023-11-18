/* eslint-disable default-param-last */
import {
	GET_MESSAGES,
	RECEIVE_MESSAGES,
	SEND_MESSAGE,
	MESSAGE_SENT,
	INIT,
} from "./ActionTypes";

import { Message } from "./Actions";

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

export const chatReducer = (
	state: ChatState = initialState,
	action: ChatActionTypes
): ChatState => {
	console.log('Reducer action:', action);
	switch (action.type) {
	case INIT:
		console.log('New state:', state);
		return initialState;
	case GET_MESSAGES:
		console.log('New state:', state);
		return {
			...state,
			isFetching: true,
		};
	case RECEIVE_MESSAGES:
		console.log('New state:', state);
		return {
			...state,
			messages: action.payload,
			isFetching: false,
		};
	case SEND_MESSAGE:
		console.log('New state:', state);
		return state;
	case MESSAGE_SENT:
		console.log('New state:', state);
		return state;
	default:
		console.log('New state:', state);
		return state;
	}
};

export default chatReducer;
