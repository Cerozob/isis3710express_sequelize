const ws = new WebSocket("ws://localhost:3000");
console.log(title);
ws.onmessage = (msg) => {
	renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
	const html = data
		.map((item) => `<p>[${item.ts}] ${item.author}: ${item.message}</p>`)
		.join(" ");
	document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
	evt.preventDefault();
	const message = document.getElementById("message");
	const author = document.getElementById("author");
	const timestamp = Date.now();
	const msgObj = {
		message: message.value,
		author: author.value,
		ts: timestamp,
	};

	ws.send(JSON.stringify(msgObj));
	message.value = "";
	author.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);
