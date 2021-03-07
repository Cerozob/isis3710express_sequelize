var express = require("express");
var router = express.Router();
const fs = require("fs");
var messages = new Map(); //clave: timestamp, valor: objeto mensaje

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.get("/chat/api/messages", function (req, res, next) {
	//TODO: mostrar todos los mensajes
});

router.get("/chat/api/messages/:ts", function (req, res, next) {
	//TODO: mostrar el mensaje con el timestamp req.params.ts

	res.render("singleMessage", { title: "view message" });
});

router.post("/chat/api/messages", function (req, res, next) {
	//TODO: crear un mensaje
	req.body;
});

router.put("/chat/api/messages/:ts", function (req, res, next) {
	//TODO: actualizar un mensaje
});

function loadMessage(data) {
	console.log(data);
	message = JSON.parse(data);
	messages.set(message.ts, message);
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

module.exports = router;
