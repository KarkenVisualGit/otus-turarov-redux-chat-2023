import {
    Message,
} from "./Actions";
/**
 * Функция для прокрутки контейнера сообщений до нижней части.
 * @param {HTMLElement} container - Контейнер для сообщений.
 */
export const scrollToBottom = (container: HTMLDivElement) => {
    container.scrollTop = container.scrollHeight;
};

/**
 * Функция для добавления сообщения в DOM.
 * @param {Message} message - Объект сообщения.
 * @param {HTMLElement} container - Контейнер для добавления сообщений.
 * @param {Function} handleDeleteMessage - Функция для обработки удаления сообщения.
 * @param {Set<string>} renderedMessageIds - Массив для хранения уникальных id.
 */
export const addMessageToDOM = (message: Message,
    container: HTMLDivElement,
    handleDeleteMessage: Function,
    renderedMessageIds: Set<string>) => {
    if (!message || renderedMessageIds.has(message.id)) {
        console.error("Некорректное сообщение:", message);
        return;
    }
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `
      <span class="message-date">${message.date.toLocaleString('en-GB')}</span>:
      <span class="message-nickname">${message.nickname}</span>:
      <span class="message-text">${message.message}</span>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', () => handleDeleteMessage(message.id, messageElement));
    messageElement.appendChild(deleteButton);

    container.appendChild(messageElement);
    renderedMessageIds.add(message.id);
};

export const insertEmoji = (target: HTMLImageElement, messageInput: HTMLDivElement) => {
    const sel: Selection | null = window.getSelection();
    const emojiImg = target.cloneNode(true) as HTMLImageElement;
    if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(emojiImg);
        const newRange = document.createRange();
        newRange.setStartAfter(emojiImg);
        newRange.collapse(true);

        sel.removeAllRanges();
        sel.addRange(newRange);
    }
};

