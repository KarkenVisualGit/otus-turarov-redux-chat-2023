import * as actions from "../Actions";
import {
	GET_MESSAGES,
	RECEIVE_MESSAGES,
	SEND_MESSAGE,
	MESSAGE_SENT,
	RECEIVE_NEW_MESSAGE,
	DELETE_MESSAGE,
	UPDATE_MESSAGES,
} from "../ActionTypes";

describe("action creators", () => {
	it("should create an action to get messages", () => {
		const expectedAction = {
			type: GET_MESSAGES,
		};
		expect(actions.getMessages()).toEqual(expectedAction);
	});

	it("should create an action to receive messages", () => {
		const messages = [
			{ id: "1", nickname: "User", message: "Test", date: new Date() },
		];
		const expectedAction = {
			type: RECEIVE_MESSAGES,
			payload: messages,
		};
		expect(actions.receiveMessages(messages)).toEqual(expectedAction);
	});

	it("should create an action to send a message", () => {
		const message = {
			id: "2",
			nickname: "User2",
			message: "Hello",
			date: new Date(),
		};
		const expectedAction = {
			type: SEND_MESSAGE,
			payload: message,
		};
		expect(actions.sendMessages(message)).toEqual(expectedAction);
	});

	it("should create an action when a message is sent", () => {
		const message = {
			id: "3",
			nickname: "User3",
			message: "Hi there",
			date: new Date(),
		};
		const expectedAction = {
			type: MESSAGE_SENT,
			payload: message,
		};
		expect(actions.messageSent(message)).toEqual(expectedAction);
	});

	it("should create an action to receive a new message", () => {
		const newMessage = {
			id: "4",
			nickname: "User4",
			message: "Good day",
			date: new Date(),
		};
		const expectedAction = {
			type: RECEIVE_NEW_MESSAGE,
			payload: newMessage,
		};
		expect(actions.receiveNewMessage(newMessage)).toEqual(expectedAction);
	});

	it("should create an action to delete a message", () => {
		const messageId = "1";
		const expectedAction = {
			type: DELETE_MESSAGE,
			payload: messageId,
		};
		expect(actions.deleteMessage(messageId)).toEqual(expectedAction);
	});

	it("should create an action to update messages", () => {
		const expectedAction = {
			type: UPDATE_MESSAGES,
		};
		expect(actions.updateMessages()).toEqual(expectedAction);
	});
});
