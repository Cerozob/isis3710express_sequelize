var express = require("express");
var router = express.Router();
const fs = require("fs");
var messagelist = new Map(); //clave: timestamp, valor: objeto mensaje
const htmlsPath = "./public/";
const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render(htmlsPath + "index");
});

router.get("/chat/api/messages", function (req, res, next) {
	//TODO: mostrar todos los mensajes
	if (messagelist.size !== 0) {
		loadFiles();
	}
	res.sendFile(path.resolve(__dirname, "../public/messages.html"));
});

router.get("/chat/api/messages/:ts", function (req, res, next) {
	//TODO: mostrar el mensaje con el timestamp req.params.ts
	let msgts = req.params.ts;
	if (messagelist.has(msgts)) {
		res.send(JSON.stringify(messagelist.get(msgts)));
	} else {
		res.status(404).send("mensaje no encontrado");
	}
});

router.post("/chat/api/messages", function (req, res, next) {
	//TODO: crear un mensaje
	saveMessage(req.body);
	res.status(200).send(req.body);
});

router.put("/chat/api/messages/:ts", function (req, res, next) {
	//TODO: actualizar un mensaje
	let ts = req.params.ts;
	let msgObj = req.body;
	if (messagelist.has(ts)) {
		messagelist.set(ts, msgObj);
		saveMessage(req.body);
		res.status(200).send(req.body);
	} else {
		res.status(404).send("mensaje no encontrado");
	}
});

function loadMessage(data) {
	message = JSON.parse(data);
	messagelist.set(message.ts, message);
	return message;
}

function loadFiles() {
	let dirpath = "./messages";
	fs.readdir(dirpath, function (err, files) {
		if (err) {
			console.log("error reading directory: " + err);
		} else {
			files.forEach((item) => {
				// la idea es cargar mensajes JSON guardados en /messages
				let filepath = dirpath + "/" + item;
				let content = fs.readFileSync(filepath, { encoding: "utf8" }, () => {
					/*por que solo funciona así?, no sé*/
				});
				loadMessage(content);
			});
		}
	});
}
loadFiles();
function saveMessage(message /* en JSON */) {
	messagelist.set(message.ts, message);
	let dirpath = "./messages/";
	let filename = message.ts + ".json";
	fs.writeFileSync(dirpath + filename, JSON.stringify(message));
}

module.exports = router;
