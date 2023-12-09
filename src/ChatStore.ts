import { chatReducer, ChatState, ChatActionTypes } from './ChatReducer';

interface AppState {
  chat: ChatState;
}

export const initialState: AppState = {
  chat: chatReducer(undefined, { type: 'INIT' }),
};

type Listener = () => void;

export class Store {
  private state: AppState;

  private listeners: Listener[] = [];

  constructor(
    private reducer: (state: AppState, action: ChatActionTypes) => AppState,
    initState: AppState,
    private middleware: (
      store: Store,
    ) => (
      next: (action: ChatActionTypes) => void,
    ) => (action: ChatActionTypes) => void,
  ) {
    this.state = initState;
  }

  getState() {
    return this.state;
  }

  dispatch(action: ChatActionTypes) {
    const dispatchWithMiddleware = this.middleware(this)(this.rawDispatch);
    dispatchWithMiddleware(action);
  }

  private rawDispatch = (action: ChatActionTypes) => {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener());
  };

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const rootReducer = (state: AppState, action: ChatActionTypes) => ({
  chat: chatReducer(state.chat, action),
});
