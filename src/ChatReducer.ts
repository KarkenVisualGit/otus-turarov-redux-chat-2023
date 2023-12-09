/* eslint-disable default-param-last */
import {
  GET_MESSAGES,
  RECEIVE_MESSAGES,
  SEND_MESSAGE,
  MESSAGE_SENT,
  INIT,
  RECEIVE_NEW_MESSAGE,
  DELETE_MESSAGE,
  UPDATE_MESSAGES,
  MESSAGE_DELETED,
} from './ActionTypes';

import { Message } from './Actions';

export interface GetMessagesAction {
  type: typeof GET_MESSAGES;
}

export interface ReceiveMessagesAction {
  type: typeof RECEIVE_MESSAGES;
  payload: Message[];
}

export interface ReceiveNewMessageAction {
  type: typeof RECEIVE_NEW_MESSAGE;
  payload: Message;
}

export interface UpdateMessagesAction {
  type: typeof UPDATE_MESSAGES;
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

export interface DeleteAction {
  type: typeof DELETE_MESSAGE;
  payload: string;
}

export interface MessageDeleteAction {
  type: typeof MESSAGE_DELETED;
  payload: string;
}

export type ChatActionTypes =
  | GetMessagesAction
  | ReceiveMessagesAction
  | ReceiveNewMessageAction
  | SendMessageAction
  | MessageSentAction
  | InitAction
  | DeleteAction
  | UpdateMessagesAction
  | MessageDeleteAction;

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
  action: ChatActionTypes,
): ChatState => {
  switch (action.type) {
    case INIT: {
      return initialState;
    }
    case GET_MESSAGES: {
      return {
        ...state,
        isFetching: true,
      };
    }
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
    case RECEIVE_NEW_MESSAGE:
      if (!action.payload) {
        // eslint-disable-next-line no-console
        console.error('Invalid message structure:', action.payload);
      }
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case DELETE_MESSAGE: {
      const newState = {
        ...state,
        messages: state.messages.filter(
          message => message.id !== action.payload,
        ),
      };
      return newState;
    }
    case MESSAGE_DELETED: {
      const delState = {
        ...state,
        messages: state.messages.filter(
          message => message.id !== action.payload,
        ),
      };
      return delState;
    }
    case UPDATE_MESSAGES:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default chatReducer;
