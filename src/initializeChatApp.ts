import { updateMessages, getMessages } from "./Actions";
import { Store } from "./ChatStore";
import {
	handleSubmit,
	handleDeleteMessage,
	handleLogout,
	toggleEmojiPicker,
} from "./eventHandlers";
import { addMessageToDOM, scrollToBottom, insertEmoji } from "./domUtils";
import { emojis } from "./emojis";

export const renderedMessageIds = new Set<string>();

export const initializeChatApp = (store: Store) => {
	store.dispatch(updateMessages());

	const messageForm = document.getElementById("send-form") as HTMLFormElement;
	const messageInput = document.getElementById("message") as HTMLDivElement;
	const logoutButton = document.getElementById("logout") as HTMLButtonElement;
	const emojiPickerButton = document.getElementById(
		"emoji-picker-button",
	) as HTMLButtonElement;
	const emojiPicker = document.getElementById("emoji-picker") as HTMLDivElement;
	const userEmail = localStorage.getItem("userEmail");
	const messagesContainer = document.getElementById(
		"messages",
	) as HTMLDivElement;
	const nicknameInput = document.getElementById("nickname") as HTMLInputElement;
	if (nicknameInput && userEmail) {
		nicknameInput.value = userEmail;
	}

	if (logoutButton) {
		logoutButton.addEventListener("click", handleLogout);
	}

	if (emojiPickerButton && emojiPicker) {
		emojiPickerButton.addEventListener("click", () =>
			toggleEmojiPicker(emojiPicker),
		);
	}

	if (emojiPicker) {
		emojiPicker.addEventListener("click", (e: Event) => {
			const target = e.target as HTMLElement;
			if (
				target &&
        target.classList.contains("emoji") &&
        target instanceof HTMLImageElement
			) {
				insertEmoji(target);
			}
		});
	}

	emojis.forEach(emoji => {
		const img = document.createElement("img");
		img.src = emoji.src;
		img.alt = emoji.alt;
		img.classList.add("emoji");
		emojiPicker?.appendChild(img);
	});

	if (messageForm) {
		messageForm.addEventListener("submit", e =>
			handleSubmit(e, messageInput, nicknameInput, store),
		);
	}

	store.subscribe(() => {
		const state = store.getState();
		state.chat.messages.forEach(message => {
			if (!renderedMessageIds.has(message.id)) {
				addMessageToDOM(
					message,
					messagesContainer,
					handleDeleteMessage,
					renderedMessageIds,
					store,
				);
			}
		});
		scrollToBottom(messagesContainer);
	});

	store.dispatch(getMessages());
};

export default initializeChatApp;
