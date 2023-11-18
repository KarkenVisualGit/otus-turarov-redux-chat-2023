import "./style/style.css";

import { sendMessage, getMessagesList, observeWithEventSource } from './chat';
import { Message, EventData } from "./Actions";
import { Store, rootReducer,initialState } from "./ChatStore";
import { chatMiddleware } from './middleware';

const store = new Store(rootReducer, initialState, chatMiddleware);

document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById('send-form') as HTMLFormElement;
    const messageInput = document.getElementById('message') as HTMLInputElement;
    const nicknameInput = document.getElementById('nickname') as HTMLInputElement;
    const messagesContainer = document.getElementById('messages') as HTMLDivElement;


    function addMessageToDOM(message: Message): void {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.nickname}: ${message.message}`;
        messagesContainer.appendChild(messageElement);
    }


    messageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const message: Message = {
            nickname: nicknameInput.value,
            message: messageInput.value,
            date: new Date()
        };
        store.dispatch({ type: 'SEND_MESSAGE', payload: message }); 
        sendMessage(message).then(() => {
            addMessageToDOM(message);
            messageInput.value = '';
        }).catch((error: Error) => {
            console.error('Ошибка отправки сообщения:', error);
        });
    });


    function displayMessages(): void {
        getMessagesList().then((messages: Message[]) => {
            messages.forEach(addMessageToDOM);
        }).catch((error: Error) => {
            console.error('Ошибка получения сообщений:', error);
        });
    }


    displayMessages();

    observeWithEventSource((eventData: EventData) => {
        if (eventData && eventData.data) {
            addMessageToDOM(eventData.data);
        }
    });

});
