import "./style/app.css";

import { Message } from "./Actions";
import { Store, rootReducer, initialState } from "./ChatStore";
import { chatMiddleware } from './middleware';
import { getMessages, sendMessages, deleteMessage } from "./Actions";
import { generateUniqueId } from "./chat";
import { initializeApp, FirebaseError } from 'firebase/app';
import {
    getAuth,
    signOut,
    connectAuthEmulator
} from 'firebase/auth';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCZsRRy7BwXZOnYz-3BIo-o4WuHl5XKkCE",
    authDomain: "task-calendar-turarov.firebaseapp.com",
    databaseURL:
        "https://task-calendar-turarov-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "task-calendar-turarov",
    storageBucket: "task-calendar-turarov.appspot.com",
    messagingSenderId: "685980356315",
    appId: "1:685980356315:web:b12ef3cf06c0bef5a646fe",
    measurementId: "G-02B3TBFPNX",
});

const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://localhost:9099");

const store = new Store(rootReducer, initialState, chatMiddleware);

document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById('send-form') as HTMLFormElement;
    const messageInput = document.getElementById('message') as HTMLInputElement;
    const logoutButton = document.getElementById('logout') as HTMLButtonElement;
    const userEmail = localStorage.getItem('userEmail');
    const nicknameInput = document.getElementById('nickname') as HTMLInputElement;
    if (nicknameInput && userEmail) {
        nicknameInput.value = userEmail;
    }
    const messagesContainer = document.getElementById('messages') as HTMLDivElement;

    const renderedMessageIds = new Set<string>();

    function scrollToBottom(): void {
        const messagesContainer = document.getElementById('messages') as HTMLDivElement;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addMessageToDOM(message: Message): void {
        if (!message || !message.nickname || !message.message || renderedMessageIds.has(message.id)) {
            console.error('Некорректное сообщение:', message);
            return;
        }
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.date?.toDateString()}:${message.nickname}: ${message.message}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', () => {
            console.log("Deleting message with ID:", message.id);
            store.dispatch(deleteMessage(message.id));
            messageElement.remove();
            renderedMessageIds.delete(message.id);
        });
        messageElement.appendChild(deleteButton);
        messagesContainer.appendChild(messageElement);
        renderedMessageIds.add(message.id);
        scrollToBottom();
    }

    logoutButton.addEventListener('click', function () {
        const auth = getAuth();
        signOut(auth).then(() => {
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error('Logout failed', error);
        });
    });


    messageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nickname = nicknameInput.value.trim();
        const messageText = messageInput.value.trim();
        if (!nickname || !messageText) {
            console.error('Nickname and message cannot be empty');
            return;
        }
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
        state.chat.messages.forEach(message => {
            if (!renderedMessageIds.has(message.id)) {
                addMessageToDOM(message);
            }
        });
    });

    store.dispatch(getMessages());

});
