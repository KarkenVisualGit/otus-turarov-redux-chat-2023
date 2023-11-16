import { GET_MESSAGES, RECEIVE_MESSAGES, SEND_MESSAGE, MESSAGE_SENT } from './ActionTypes';

interface Message {
  nickname: string;
  message: string;
  date: Date;
}

interface GetMessagesAction {
    type: typeof GET_MESSAGES;
}

interface ReceiveMessagesAction {
    type: typeof RECEIVE_MESSAGES;
    payload: Message[];
}

interface SendMessageAction {
    type: typeof SEND_MESSAGE;
    payload: Message;
}

interface MessageSentAction {
    type: typeof MESSAGE_SENT;
    payload: Message;
}

type ChatActionTypes = GetMessagesAction
    | ReceiveMessagesAction
    | SendMessageAction
    | MessageSentAction;


interface ChatState {
  messages: Message[];
  isFetching: boolean; 
}

const initialState: ChatState = {
  messages: [],
  isFetching: false,
};

const chatReducer = (state = initialState, action: ChatActionTypes): ChatState => {
    switch (action.type) {
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
  