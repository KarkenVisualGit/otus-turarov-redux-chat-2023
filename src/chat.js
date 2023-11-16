import fetch from "node-fetch";

const config = {
	firebaseBaseUrl:
    "https://task-calendar-turarov-default-rtdb.asia-southeast1.firebasedatabase.app",
	firebaseCollection: "messages.json",
};

// /**
//  * @return {Object[]} messagesList
//  */
async function getMessagesList() {
	return fetch(`${config.firebaseBaseUrl}/${config.firebaseCollection}`, {
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) =>
			Object.values(data).map((el) => ({
				...el,
				date: new Date(el.date),
			}))
		);
}

// /**
//  * @param {Object} data
//  * @param {string} data.nickname
//  * @param {string} data.message
//  * @returns {boolean}
//  */
async function sendMessage(data) {
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

function observeWithXHR(cb) {
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

function observeWithEventSource(cb) {
	// https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource
	const evtSource = new EventSource(
		`${config.firebaseBaseUrl}/${config.firebaseCollection}`
	);

	evtSource.addEventListener("put", (ev) => cb(JSON.parse(ev.data).data));
}

sendMessage({ nickname: "testUser", message: "Hello, this is a test message!" })
	.then((response) => {
		console.log("Message sent successfully:", response);
	})
	.catch((error) => {
		console.error("Error sending message:", error);
	});

getMessagesList()
	.then((messages) => {
		console.log("Retrieved messages:", JSON.stringify(messages, null, 2));
	})
	.catch((error) => {
		console.error("Error retrieving messages:", error);
	});

//   window.sendMessage = sendMessage;
//   window.getMessagesList = getMessagesList;
window.observeWithXHR = observeWithXHR;
window.observeWithEventSource = observeWithEventSource;
