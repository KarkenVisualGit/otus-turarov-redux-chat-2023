import "./style/style.css";

import { Message } from "./Actions";
import { Store, rootReducer, initialState } from "./ChatStore";
import { chatMiddleware } from './middleware';
import { getMessages, sendMessages, receiveNewMessage } from "./Actions";

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
        messagesContainer.appendChild(messageElement);
    }


    messageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const message: Message = {
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
