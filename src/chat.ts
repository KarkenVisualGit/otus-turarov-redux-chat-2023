import { Message, EventData } from "./Actions";

export const firebaseConfig = {
	apiKey: "AIzaSyCZsRRy7BwXZOnYz-3BIo-o4WuHl5XKkCE",
	authDomain: "task-calendar-turarov.firebaseapp.com",
	databaseURL:
    "https://task-calendar-turarov-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "task-calendar-turarov",
	storageBucket: "task-calendar-turarov.appspot.com",
	messagingSenderId: "685980356315",
	appId: "1:685980356315:web:b12ef3cf06c0bef5a646fe",
	measurementId: "G-02B3TBFPNX",
};

export interface SendMessageResponse {
  name: string;
}

export interface ServerResponse {
  [key: string]: Message;
}

export interface EventDataRec {
  data: ServerResponse;
}

const config = {
	firebaseBaseUrl:
    "https://task-calendar-turarov-default-rtdb.asia-southeast1.firebasedatabase.app",
	firebaseCollection: "messages.json",
};

export async function getMessagesList(): Promise<Message[]> {
	return fetch(`${config.firebaseBaseUrl}/${config.firebaseCollection}`, {
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data: ServerResponse) =>
			Object.values(data).map((el: Message) => ({
				...el,
				date: new Date(el.date || Date.now()),
			}))
		);
}

// /**
//  * @param {Object} data
//  * @param {string} data.nickname
//  * @param {string} data.message
//  * @returns {boolean}
//  */
export async function sendMessage(data: Message): Promise<SendMessageResponse> {
	return fetch(`${config.firebaseBaseUrl}/${config.firebaseCollection}`, {
		method: "POST",
		body: JSON.stringify({
			...data,
			date: new Date(),
		}),
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
	}).then((response) => response.json());
}

export async function getMessagesWithIds(): Promise<{
  [key: string]: Message;
}> {
	const response = await fetch(
		`${config.firebaseBaseUrl}/${config.firebaseCollection}`
	);
	return response.json();
}

export async function deleteMessageId(messageId: string): Promise<void> {
	const messages = await getMessagesWithIds();
	const firebaseId = Object.keys(messages).find(
		(key) => messages[key].id === messageId
	);
	if (!firebaseId) {
		throw new Error("Message ID not found in Firebase");
	}
	const url = `${config.firebaseBaseUrl}/messages/${firebaseId}.json`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
	console.log(response);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
}

/* export function observeWithXHR(cb: (data: EventData) => void): void {
	// https://firebase.google.com/docs/reference/rest/database#section-streaming
	const xhr = new XMLHttpRequest();
	let lastResponseLength = 0;

	xhr.addEventListener("progress", () => {
		// console.log("xhr body", xhr.response);
		const body = xhr.response.substr(lastResponseLength);
		lastResponseLength = xhr.response.length;

		const eventType = body.match(/event: (.+)/)[1];
		const data = JSON.parse(body.match(/data: (.+)/)[1]);

		if (eventType === "put") {
			cb(data.data);
		}
	});

	xhr.open(
		"POST",
		`${config.firebaseBaseUrl}/${config.firebaseCollection}`,
		true
	);
	xhr.setRequestHeader("Accept", "text/event-stream");

	xhr.send();
} */

export function observeWithEventSource(cb: (data: EventDataRec) => void): void {
	// https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource
	const evtSource = new EventSource(
		`${config.firebaseBaseUrl}/${config.firebaseCollection}`
	);

	evtSource.addEventListener("put", (ev) => {
		const { data } = JSON.parse(ev.data);
		cb(data);
	});
}

export function generateUniqueId() {
	const timestamp = new Date().getTime();
	const randomPart = Math.random().toString(36).substring(2, 15);
	const uniqueId = `${timestamp}-${randomPart}`;
	return uniqueId;
}
