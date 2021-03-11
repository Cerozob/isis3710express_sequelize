const WebSocket = require("ws");
const fs = require("fs");
const clients = [];
const messages = [];

const wsConnection = (server) => {
	const wss = new WebSocket.Server({ server });

	wss.on("connection", (ws) => {
		clients.push(ws);
		sendMessages();
		ws.on("message", (message) => {
			messages.push(JSON.parse(message));
			sendMessages();
			saveMessage(message);
		});
	});
	const sendMessages = () => {
		clients.forEach((client) => client.send(JSON.stringify(messages)));
	};
	/* no entendi como enviarle eso al servidor haciendo el submit*/
	const saveMessage = (message) => {
		let dirpath = "./messages/";
		let filename = JSON.parse(message).ts + ".json";

		fs.writeFile(dirpath + filename, message, { encoding: "utf8" }, (err) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

exports.wsConnection = wsConnection;
