import { jest } from "@jest/globals";
import { chatMiddleware } from "../middleware";
import { Store } from "../ChatStore";
import * as chatApi from "../chat";
import { ChatActionTypes } from "../ChatReducer";

jest.mock("../chat");

describe("chatMiddleware", () => {
  let storeMock: Store;
  let nextMock: jest.Mock;
  let actionMock: ChatActionTypes;

  beforeEach(() => {
    storeMock = { dispatch: jest.fn() } as unknown as Store;
    nextMock = jest.fn();
    jest.mocked(chatApi.deleteMessageId).mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle DELETE_MESSAGE action successfully", async () => {
    const messageId = "1";
    actionMock = { type: "DELETE_MESSAGE", payload: messageId };
    const middleware = chatMiddleware(storeMock);

    await middleware(nextMock)(actionMock);

    expect(chatApi.deleteMessageId).toHaveBeenCalledWith(messageId);
    expect(storeMock.dispatch).toHaveBeenCalledWith({
      type: "MESSAGE_DELETED",
      payload: messageId,
    });
  });
});
