import { initializeChatApp } from "../initializeChatApp";
import { store } from "../application";
import * as actions from "../Actions";
import { handleLogout } from "../eventHandlers";

jest.mock("../application", () => ({
	store: {
		dispatch: jest.fn(),
		subscribe: jest.fn((callback) => callback()),
		getState: jest.fn(() => ({ chat: { messages: [] } })),
	},
}));

jest.mock("../eventHandlers", () => ({
	handleSubmit: jest.fn(),
	handleDeleteMessage: jest.fn(),
	handleLogout: jest.fn(),
	toggleEmojiPicker: jest.fn(),
}));

jest.mock("../domUtils", () => ({
	addMessageToDOM: jest.fn(),
	scrollToBottom: jest.fn(),
	insertEmoji: jest.fn(),
}));

describe("initializeApp", () => {
	let logoutButton: HTMLButtonElement;
	let emojiPickerButton: HTMLElement;
	let sendForm: HTMLFormElement;
	beforeEach(() => {
		document.body.innerHTML = `
      <form id="send-form"></form>
      <div id="message"></div>
      <button id="logout"></button>
      <div id="emoji-picker-button"></div>
      <div id="emoji-picker"></div>
      <div id="messages"></div>
      <input id="nickname" />
    `;

		logoutButton = document.getElementById("logout") as HTMLButtonElement;
		emojiPickerButton = document.getElementById(
			"emoji-picker-button"
		) as HTMLElement;
		sendForm = document.getElementById("send-form") as HTMLFormElement;

		jest.spyOn(logoutButton, "addEventListener");
		jest.spyOn(emojiPickerButton, "addEventListener");
		jest.spyOn(sendForm, "addEventListener");

		initializeChatApp(store);
	});

	it("should set up event handlers", () => {
		expect(logoutButton.addEventListener).toHaveBeenCalledWith(
			"click",
			handleLogout
		);
		expect(emojiPickerButton.addEventListener).toHaveBeenCalledWith(
			"click",
			expect.any(Function)
		);
		expect(sendForm.addEventListener).toHaveBeenCalledWith(
			"submit",
			expect.any(Function)
		);
	});

	it("should dispatch Redux actions", () => {
		expect(store.dispatch).toHaveBeenCalledWith(actions.updateMessages());
		expect(store.dispatch).toHaveBeenCalledWith(actions.getMessages());
	});

	it("should subscribe to the store", () => {
		expect(store.subscribe).toHaveBeenCalled();
	});
});
