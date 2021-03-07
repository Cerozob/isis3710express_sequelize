var express = require("express");
var router = express.Router();
const fs = require("fs");
var messagelist = new Map(); //clave: timestamp, valor: objeto mensaje

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.get("/chat/api/messages", function (req, res, next) {
	//TODO: mostrar todos los mensajes
	res.render("messages", { messages: messagelist });
});

router.get("/chat/api/messages/:ts", function (req, res, next) {
	//TODO: mostrar el mensaje con el timestamp req.params.ts
	let msgts = req.params.ts;
	if (messagelist.has(msgts)) {
		res.render("singleMessage", { msg: messagelist.get(msgts) });
	} else {
		res.status(404).send("mensaje no encontrado");
	}
});

router.post("/chat/api/messages", function (req, res, next) {
	//TODO: crear un mensaje

	console.log(req.body);
});

router.put("/chat/api/messages/:ts", function (req, res, next) {
	//TODO: actualizar un mensaje
	if (messagelist.has(msgts)) {
		res.render("singleMessage", { msg: messagelist.get(msgts) });
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

function saveMessage(message /* en JSON */) {
	let dirpath = "./messages/";
	let filename = message.ts;
	fs.writeFileSync(dirpath + filename, message);
}

module.exports = router;
