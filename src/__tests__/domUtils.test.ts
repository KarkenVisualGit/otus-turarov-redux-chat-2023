import { scrollToBottom, addMessageToDOM, insertEmoji } from "../domUtils";
import { Store } from "../ChatStore";

const mockStore = {
  dispatch: jest.fn(),
} as unknown as Store;

describe("scrollToBottom", () => {
  it("should scroll the container to the bottom", () => {
    const container = document.createElement("div");
    Object.defineProperty(container, "scrollHeight", { value: 1000 });
    Object.defineProperty(container, "scrollTop", { value: 0, writable: true });

    scrollToBottom(container);

    expect(container.scrollTop).toBe(1000);
  });
});

describe("addMessageToDOM", () => {
  it("should add a message element to the container", () => {
    const message = {
      id: "1",
      date: new Date(),
      nickname: "User",
      message: "Hello",
    };
    const container = document.createElement("div");
    const renderedMessageIds = new Set<string>();

    addMessageToDOM(
      message,
      container,
      jest.fn(),
      renderedMessageIds,
      mockStore
    );

    expect(container.innerHTML).toContain(message.message);
    expect(renderedMessageIds.has(message.id)).toBeTruthy();
  });

  it("should not add a message if it already exists", () => {
    const message = {
      id: "1",
      date: new Date(),
      nickname: "User",
      message: "Hello",
    };
    const container = document.createElement("div");
    const renderedMessageIds = new Set<string>([message.id]);

    addMessageToDOM(
      message,
      container,
      jest.fn(),
      renderedMessageIds,
      mockStore
    );

    expect(container.childElementCount).toBe(0);
  });
});

describe("insertEmoji", () => {
  it("should insert an emoji into the message input", () => {
    const target = document.createElement("img");
    const messageInput = document.createElement("div");
    messageInput.contentEditable = "true";
    document.getSelection = () => {
      const range = document.createRange();
      range.selectNodeContents(messageInput);
      return {
        rangeCount: 1,
        getRangeAt: () => range,
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
      } as unknown as Selection;
    };

    insertEmoji(target);

    expect(messageInput.innerHTML).toContain(target.outerHTML);
  });
});
