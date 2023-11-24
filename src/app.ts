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

const emojis = [
    { src: './image/AngryFacewithHorns.svg', alt: 'Angry_Face_with_Horns' },
    { src: './image/Angry Face.svg', alt: 'Angry_Face' },
    { src: './image/Anguished Face.svg', alt: 'Anguished_Face' },
    { src: './image/Anxious Face with Sweat.svg', alt: 'Anxious_Face_with_Sweat' },
    { src: './image/Astonished Face.svg', alt: 'Astonished_Face' },
    { src: './image/Awkward Face.svg', alt: 'Awkward_Face' },
    { src: './image/Beaming Face with Smiling Eyes.svg', alt: 'Beaming_Face_with_Smiling_Eyes' },
    { src: './image/Beaming Face with Squinting Eyes.svg', alt: 'Beaming_Face_with_Squinting_Eyes' },
    { src: './image/Chewing Face.svg', alt: 'Chewing_Face' },
    { src: './image/Cold Face.svg', alt: 'Cold_Face' },
    { src: './image/Confounded Face.svg', alt: 'Confounded_Face' },
    { src: './image/Confused Face.svg', alt: 'Confused_Face' },
    { src: './image/Cowboy Hat Face.svg', alt: 'Cowboy_Hat_Face' },
    { src: './image/Cute Pleading Face.svg', alt: 'Cute_Pleading_Face' },
    { src: './image/Disappointed Face.svg', alt: 'Disappointed_Face' },
    { src: './image/Disguised Face.svg', alt: 'Disguised_Face' },
    { src: './image/Dizzy Face.svg', alt: 'Dizzy_Face' },
    { src: './image/Downcast Face with Sweat.svg', alt: 'Downcast_Face_with_Sweat' },
    { src: './image/Downcast Face.svg', alt: 'Downcast_Face' },
    { src: './image/Drooling Face with Heart-Eyes.svg', alt: 'Drooling_Face_with_Heart-Eyes' },
    { src: './image/Drooling Face.svg', alt: 'Drooling_Face' },
    { src: './image/Envious Face.svg', alt: 'Envious_Face' },
    { src: './image/Exploding Head.svg', alt: 'Exploding_Head' },
    { src: './image/Expressionless Face.svg', alt: 'Expressionless_Face' },
    { src: './image/Face Blowing a Kiss With Eyes Closed.svg', alt: 'Face_Blowing_a_Kiss_With_Eyes_Closed' },
    { src: './image/Face Blowing a Kiss.svg', alt: 'Face_Blowing_a_Kiss' },
    { src: './image/Face Exhaling.svg', alt: 'Face_Exhaling' },
    { src: './image/Face Savoring Food.svg', alt: 'Face_Savoring_Food' },
    { src: './image/Face Screaming in Fear.svg', alt: 'Face_Screaming_in_Fear' },
    { src: './image/Face Vomiting.svg', alt: 'Face_Vomiting' },
    { src: './image/Face Without Mouth Looking Left.svg', alt: 'Face_Without_Mouth_Looking_Left' },
    { src: './image/Face Without Mouth Looking Right.svg', alt: 'Face_Without_Mouth_Looking_Right' },
    { src: './image/Face Without Mouth Looking Straight.svg', alt: 'Face_Without_Mouth_Looking_Straight' },
    { src: './image/Face in Clouds.svg', alt: 'Face_in_Clouds' },
    { src: './image/Face with Hand Over Mouth.svg', alt: 'Face_with_Hand_Over_Mouth' },
    { src: './image/Face with Head-Bandage.svg', alt: 'Face_with_Head-Bandage' },
    { src: './image/Face with Medical Mask.svg', alt: 'Face_with_Medical_Mask' },
    { src: './image/Face with Monocle.svg', alt: 'Face_with_Monocle' },
    { src: './image/Face with Open Mouth.svg', alt: 'Face_with_Open_Mouth' },
    { src: './image/Face with Raised Eyebrow.svg', alt: 'Face_with_Raised_Eyebrow' },
    { src: './image/Sad but Relieved Face.svg', alt: 'Sad_but_Relieved_Face' },
    { src: './image/Shocked Face With Sunglasses.svg', alt: 'Shocked_Face_With_Sunglasses' },
    { src: './image/Shushing Face.svg', alt: 'Shushing_Face' },
    { src: './image/Shy Smiling Call Face.svg', alt: 'Shy_Smiling_Call_Face' },
    { src: './image/Shy Smiling Face.svg', alt: 'Shy_Smiling_Face' },
    { src: './image/Sleeping Face.svg', alt: 'Sleeping_Face' },
    { src: './image/Sleepy Face.svg', alt: 'Sleepy_Face' },
    { src: './image/Slightly Frowning Face.svg', alt: 'Slightly_Frowning_Face' },
    { src: './image/Slightly Smiling Face.svg', alt: 'Slightly_Smiling_Face' },
    { src: './image/Smiling Face and Eyes Calling.svg', alt: 'Smiling_Face_and_Eyes_Calling' },
    { src: './image/Smiling Face with Fire-Eyes.svg', alt: 'Smiling_Face_with_Fire-Eyes' },
    { src: './image/Smiling Face with Halo.svg', alt: 'Smiling_Face_with_Halo' },
    { src: './image/Smiling Face with Heart-Eyes.svg', alt: 'Smiling_Face_with_Heart-Eyes' },
    { src: './image/Smiling Face with Hearts.svg', alt: 'Smiling_Face_with_Hearts' },
    { src: './image/Smiling Face with Horns.svg', alt: 'Smiling_Face_with_Horns' },
    { src: './image/Smiling Face with Smiling Eyes.svg', alt: 'Smiling_Face_with_Smiling_Eyes' },
    { src: './image/Smiling Face with Sunglasses.svg', alt: 'Smiling_Face_with_Sunglasses' },
    { src: './image/Smiling Face with Tear.svg', alt: 'Smiling_Face_with_Tear' },
    { src: './image/Smiling Face.svg', alt: 'Smiling_Face' },
    { src: './image/Smirking Face.svg', alt: 'Smirking_Face' },
    { src: './image/Sneezing Face.svg', alt: 'Sneezing_Face' },
    { src: './image/Squinting Face with Tongue.svg', alt: 'Squinting_Face_with_Tongue' },
    { src: './image/Star-Struck.svg', alt: 'Star-Struck' },
    { src: './image/Stoned Face.svg', alt: 'Stoned_Face' },
    { src: './image/Suspicious Face With Monocle.svg', alt: 'Suspicious_Face_With_Monocle' },
    { src: './image/Suspicious Face.svg', alt: 'Suspicious_Face' }
];



document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById('send-form') as HTMLFormElement;
    const messageInput = document.getElementById('message') as HTMLDivElement;
    const logoutButton = document.getElementById('logout') as HTMLButtonElement;
    const emojiPickerButton = document.getElementById('emoji-picker-button') as HTMLButtonElement;
    const emojiPicker = document.getElementById('emoji-picker') as HTMLDivElement;
    const userEmail = localStorage.getItem('userEmail');
    const nicknameInput = document.getElementById('nickname') as HTMLInputElement;
    if (nicknameInput && userEmail) {
        nicknameInput.value = userEmail;
    }
    const messagesContainer = document.getElementById('messages') as HTMLDivElement;

    const renderedMessageIds = new Set<string>();

    emojis.forEach(emoji => {
        const img = document.createElement('img');
        img.src = emoji.src;
        img.alt = emoji.alt;
        img.classList.add('emoji');
        emojiPicker.appendChild(img);
    });

    function scrollToBottom(): void {
        const messagesContainer = document.getElementById('messages') as HTMLDivElement;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    emojiPickerButton.addEventListener('click', () => {
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    })

    emojiPicker.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;

        if (target && target.classList.contains('emoji')) {
            if (target instanceof HTMLImageElement && messageInput) {
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
            }
        }
    });

    function addMessageToDOM(message: Message): void {
        if (!message || !message.nickname || !message.message || renderedMessageIds.has(message.id)) {
            console.error('Некорректное сообщение:', message);
            return;
        }
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `${message.date?.toDateString()}:${message.nickname}: `;
        const messageText = document.createElement('span');
        messageText.innerHTML = message.message;
        messageElement.appendChild(messageText);
        
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
        const messageContent = messageInput.innerHTML.trim();
        if (!nickname || !messageContent) {
            console.error('Nickname and message cannot be empty');
            return;
        }
        const messageId = generateUniqueId();
        const message: Message = {
            id: messageId,
            nickname: nickname,
            message: messageContent,
            date: new Date()
        };
        store.dispatch(sendMessages(message));
        messageInput.innerHTML = '';
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
