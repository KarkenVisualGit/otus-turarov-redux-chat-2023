import chatReducer, { ChatState, ChatActionTypes } from "./ChatReducer";

interface AppState {
  chat: ChatState;
}

const initialState: AppState = {
	chat: chatReducer(undefined, { type: "INIT" }),
};

class Store {
	private state: AppState;

	private listeners: Function[] = [];

	constructor(
    private reducer: (state: AppState, action: ChatActionTypes) => AppState,
    initialState: AppState
	) {
		this.state = initialState;
	}

	getState() {
		return this.state;
	}

	dispatch(action: ChatActionTypes) {
		this.state = this.reducer(this.state, action);
		this.listeners.forEach((listener) => listener());
	}

	subscribe(listener: Function) {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	}
}

const rootReducer = (state: AppState, action: ChatActionTypes) => ({
	chat: chatReducer(state.chat, action),
});

const store = new Store(rootReducer, initialState);

export default store;
