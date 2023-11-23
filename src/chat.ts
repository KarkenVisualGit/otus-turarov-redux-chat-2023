import { Message, EventData } from "./Actions";

interface SendMessageResponse {
	name: string;
}

interface ServerResponse {
	[key: string]: Message;
}

const config = {
	firebaseBaseUrl:
		"https://task-calendar-turarov-default-rtdb.asia-southeast1.firebasedatabase.app",
	firebaseCollection: "messages.json",
};

// const monitorAuthState = async () => {
// 	onAuthStateChanged(auth, user => {
// 		if (user) {
// 			console.log(user)
// 			showApp()
// 			showLoginState(user)

// 			hideLoginError()
// 			hideLinkError()
// 		}
// 		else {
// 			showLoginForm()
// 			lblAuthState.innerHTML = `You're not logged in.`
// 		}
// 	})
// }

// export const showLoginForm = () => {
// 	login.style.display = 'block'
// 	app.style.display = 'none'
// }

// export const showApp = () => {
// 	login.style.display = 'none'
// 	app.style.display = 'block'
// }

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

export async function getMessagesWithIds(): Promise<{ [key: string]: Message }> {
	const response = await fetch(`${config.firebaseBaseUrl}/${config.firebaseCollection}`);
	return response.json();
}

export async function deleteMessageId(messageId: string): Promise<void> {
	try {
		const messages = await getMessagesWithIds();
		const firebaseId = Object.keys(messages).find(key => messages[key].id === messageId);
		if (!firebaseId) {
			console.log("Firebase ID:", firebaseId);
			throw new Error('Message ID not found in Firebase');
		}
		const url = `${config.firebaseBaseUrl}/messages/${firebaseId}.json`;
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			}
		});
		if (!response.ok) {
			console.log("Response status:", response.status);
			throw new Error('Network response was not ok');
		}
	} catch (error) {
		console.error('Failed to delete message:', error);
		throw error;
	}
}

export function observeWithXHR(cb: (data: EventData) => void): void {
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
}

export function observeWithEventSource(cb: (data: EventData) => void): void {
	// https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource
	const evtSource = new EventSource(
		`${config.firebaseBaseUrl}/${config.firebaseCollection}`
	);

	evtSource.addEventListener("put", (ev) => {
		console.log(JSON.parse(ev.data).data);
		cb(JSON.parse(ev.data).data);

	});
	evtSource.addEventListener("delete", (ev) => {
		console.log(JSON.parse(ev.data).data);
		cb(JSON.parse(ev.data).data);
	});
}

export function generateUniqueId() {
	const timestamp = new Date().getTime();
	const randomPart = Math.random().toString(36).substring(2, 15);
	const uniqueId = `${timestamp}-${randomPart}`;
	return uniqueId;
}


