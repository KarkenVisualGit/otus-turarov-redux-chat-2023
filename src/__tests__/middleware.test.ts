import { chatMiddleware } from "../middleware";
import { Store } from "../ChatStore";
import * as chatApi from "../chat";
import { ChatActionTypes, SendMessageAction } from "../ChatReducer";

jest.mock("../chat");

describe("chatMiddleware", () => {
	let storeMock: Store;
	let nextMock: jest.Mock;
	let actionMock: ChatActionTypes;

	beforeEach(() => {
		storeMock = { dispatch: jest.fn() } as unknown as Store;
		nextMock = jest.fn();
		const sendMessageMock = jest.mocked(chatApi.sendMessage);
		sendMessageMock.mockResolvedValue({
			name: "uniqueMessageId",
		});
		jest.clearAllMocks();
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2023-12-07T06:15:44.308Z"));
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	it("should handle SEND_MESSAGE action", async () => {
		const testMessage = {
			id: "1",
			nickname: "User",
			message: "Test",
			date: new Date(),
		};
		actionMock = {
			type: "SEND_MESSAGE",
			payload: testMessage,
		} as SendMessageAction;

		const middleware = chatMiddleware(storeMock);
		await middleware(nextMock)(actionMock);

		expect(chatApi.sendMessage).toHaveBeenCalledWith(testMessage);
		expect(storeMock.dispatch).toHaveBeenCalledWith({
			type: "MESSAGE_SENT",
			payload: testMessage,
		});
		expect(storeMock.dispatch).toHaveBeenCalledWith({ type: "GET_MESSAGES" });
		jest.clearAllMocks();
	});

	it("should handle GET_MESSAGES action", async () => {
		const getMessagesListMock = jest.mocked(chatApi.getMessagesList);
		getMessagesListMock.mockResolvedValue([
			{ id: "1", nickname: "User", message: "Test", date: new Date() },
		]);
		actionMock = { type: "GET_MESSAGES" };
		const middleware = chatMiddleware(storeMock);

		await middleware(nextMock)(actionMock);

		expect(chatApi.getMessagesList).toHaveBeenCalled();
		expect(storeMock.dispatch).toHaveBeenCalledWith({
			type: "RECEIVE_MESSAGES",
			payload: [
				{ id: "1", nickname: "User", message: "Test", date: new Date() },
			],
		});
	});
});
