import {
	chatReducer,
	initialState,
	ChatState,
	GetMessagesAction,
	SendMessageAction,
	ReceiveMessagesAction,
	MessageSentAction,
	ReceiveNewMessageAction,
	DeleteAction,
	MessageDeleteAction,
	UpdateMessagesAction,
} from "../ChatReducer";
import {
	INIT,
	GET_MESSAGES,
	SEND_MESSAGE,
	RECEIVE_MESSAGES,
	MESSAGE_SENT,
	RECEIVE_NEW_MESSAGE,
	DELETE_MESSAGE,
	MESSAGE_DELETED,
	UPDATE_MESSAGES,
} from "../ActionTypes";
import { Message } from "../Actions";

describe("chatReducer", () => {
	it("should return the initial state", () => {
		expect(chatReducer(undefined, { type: INIT })).toEqual(initialState);
	});

	it("should handle GET_MESSAGES", () => {
		const startAction: GetMessagesAction = {
			type: GET_MESSAGES,
		};
		expect(chatReducer(initialState, startAction)).toEqual({
			...initialState,
			isFetching: true,
		});
	});

	it("should not mutate the state on SEND_MESSAGE", () => {
		const messageToSend = {
			id: "1",
			nickname: "User",
			message: "Test",
			date: new Date(),
		};
		const action: SendMessageAction = {
			type: SEND_MESSAGE,
			payload: messageToSend,
		};
		const state = chatReducer(initialState, action);
		expect(state).toEqual(initialState);
	});

	it("should handle RECEIVE_MESSAGES", () => {
		const messages: Message[] = [
			{ id: "1", nickname: "User", message: "Test", date: new Date() },
		];
		const receiveAction: ReceiveMessagesAction = {
			type: RECEIVE_MESSAGES,
			payload: messages,
		};
		const expectedState: ChatState = {
			...initialState,
			messages,
			isFetching: false,
		};
		expect(chatReducer(initialState, receiveAction)).toEqual(expectedState);
	});

	it("should not change the state on MESSAGE_SENT", () => {
		const testinitialState = { messages: [], isFetching: false };
		const messageSentAction: MessageSentAction = {
			type: MESSAGE_SENT,
			payload: {
				id: "1",
				nickname: "User",
				message: "Hello",
				date: new Date(),
			},
		};

		expect(chatReducer(testinitialState, messageSentAction)).toEqual(
			testinitialState
		);
	});

	it("should handle RECEIVE_NEW_MESSAGE", () => {
		const testinitialState = { messages: [], isFetching: false };
		const newMessage = {
			id: "2",
			nickname: "User2",
			message: "Hi",
			date: new Date(),
		};
		const receiveNewMessageAction: ReceiveNewMessageAction = {
			type: RECEIVE_NEW_MESSAGE,
			payload: newMessage,
		};

		const expectedState = {
			...testinitialState,
			messages: [...testinitialState.messages, newMessage],
		};

		expect(chatReducer(testinitialState, receiveNewMessageAction)).toEqual(
			expectedState
		);
	});

	it("should handle DELETE_MESSAGE", () => {
		const testinitialState = {
			messages: [
				{ id: "1", nickname: "User1", message: "Hello", date: new Date() },
				{ id: "2", nickname: "User2", message: "Hi", date: new Date() },
			],
			isFetching: false,
		};
		const deleteAction: DeleteAction = {
			type: DELETE_MESSAGE,
			payload: "1",
		};

		const expectedState = {
			...testinitialState,
			messages: testinitialState.messages.filter(
				(message) => message.id !== deleteAction.payload
			),
		};

		expect(chatReducer(testinitialState, deleteAction)).toEqual(expectedState);
	});

	it("should handle MESSAGE_DELETED", () => {
		const testinitialState = {
			messages: [
				{ id: "1", nickname: "User1", message: "Hello", date: new Date() },
				{ id: "2", nickname: "User2", message: "Hi", date: new Date() },
			],
			isFetching: false,
		};
		const messageDeletedAction: MessageDeleteAction = {
			type: MESSAGE_DELETED,
			payload: "1",
		};

		const expectedState = {
			...testinitialState,
			messages: testinitialState.messages.filter(
				(message) => message.id !== messageDeletedAction.payload
			),
		};

		expect(chatReducer(testinitialState, messageDeletedAction)).toEqual(
			expectedState
		);
	});

	it("should handle UPDATE_MESSAGES", () => {
		const testinitialState = {
			messages: [
				{ id: "1", nickname: "User", message: "Test", date: new Date() },
			],
			isFetching: false,
		};
		const updateAction: UpdateMessagesAction = {
			type: UPDATE_MESSAGES,
		};

		expect(chatReducer(testinitialState, updateAction)).toEqual(
			testinitialState
		);
	});
});
