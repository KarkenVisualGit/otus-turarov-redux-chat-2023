import { sendMessages, deleteMessage, Message } from './Actions';
import { generateUniqueId, firebaseConfig } from "./chat";
import { store } from "./application";
import { getAuth, signOut, connectAuthEmulator } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://localhost:9099");

export const handleLogout = () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Logout failed", error);
    });
};

export const toggleEmojiPicker = (emojiPicker: HTMLElement) => {
  emojiPicker.style.display =
    emojiPicker.style.display === "none" ? "block" : "none";
};

/**
 * Обработчик события отправки сообщения.
 * @param e - объект события
 * @param messageInput - элемент ввода сообщения
 * @param nicknameInput - элемент ввода никнейма
 */
export const handleSubmit = (e: Event, messageInput: HTMLDivElement, nicknameInput: HTMLInputElement) => {
  e.preventDefault();

  const nickname = nicknameInput.value.trim();
  const messageContent = messageInput.innerHTML.trim();

  if (!nickname || !messageContent) {
    console.error("Nickname and message cannot be empty");
    return;
  }

  const message: Message = {
    id: generateUniqueId(),
    nickname,
    message: messageContent,
    date: new Date(),
  };

  store.dispatch(sendMessages(message));
  messageInput.innerHTML = "";
};

/**
 * Обработчик события удаления сообщения.
 * @param messageId - идентификатор сообщения
 * @param messageElement - элемент DOM, представляющий сообщение
 */
export const handleDeleteMessage = (messageId: string, messageElement: HTMLElement) => {
  store.dispatch(deleteMessage(messageId));
  messageElement.remove();
};
