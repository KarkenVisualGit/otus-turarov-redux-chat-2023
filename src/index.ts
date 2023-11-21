import "./style/style.css";

import { Message } from "./Actions";
import { Store, rootReducer, initialState } from "./ChatStore";
import { chatMiddleware } from './middleware';
import { getMessages, sendMessages, deleteMessage } from "./Actions";
import { generateUniqueId } from "./chat"

const store = new Store(rootReducer, initialState, chatMiddleware);

document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById('send-form') as HTMLFormElement;
    const messageInput = document.getElementById('message') as HTMLInputElement;
    const nicknameInput = document.getElementById('nickname') as HTMLInputElement;
    const messagesContainer = document.getElementById('messages') as HTMLDivElement;


    function addMessageToDOM(message: Message): void {
        if (!message || !message.nickname || !message.message) {
            console.error('Некорректное сообщение:', message);
            return;
        }
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.date?.toDateString()}:${message.nickname}: ${message.message}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', () => {
            console.log("Deleting message with ID:", message.id);
            store.dispatch(deleteMessage(message.id!));
        });
        messageElement.appendChild(deleteButton);
        messagesContainer.appendChild(messageElement);
    }


    messageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const messageId = generateUniqueId();
        const message: Message = {
            id: messageId,
            nickname: nicknameInput.value,
            message: messageInput.value,
            date: new Date()
        };
        store.dispatch(sendMessages(message));
        messageInput.value = '';
    });
        

        store.subscribe(() => {
            const state = store.getState();
            messagesContainer.innerHTML = '';
            state.chat.messages.forEach(addMessageToDOM);
        });

        store.dispatch(getMessages());

    });
