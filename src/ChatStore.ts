import chatReducer, { ChatState, ChatActionTypes } from "./ChatReducer";

interface AppState {
  chat: ChatState;
}

const initialState: AppState = {
	chat: chatReducer(undefined, { type: "INIT" }),
};

type Listener = () => void;

class Store {
	private state: AppState;

	private listeners: Listener[] = [];

	constructor(
    private reducer: (state: AppState, action: ChatActionTypes) => AppState,
    initState: AppState
	) {
		this.state = initState;
	}

	getState() {
		return this.state;
	}

	dispatch(action: ChatActionTypes) {
		this.state = this.reducer(this.state, action);
		this.listeners.forEach((listener) => listener());
	}

	subscribe(listener: Listener) {
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
