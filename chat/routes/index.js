var express = require("express");
var router = express.Router();
const fs = require("fs");
const messagelist = new Map(); //clave: timestamp, valor: objeto mensaje
const ejs = require("ejs");
const joi = require("joi");
const sequelize = require("./lib/sequelize");
const Joi = require("joi");

const schema = Joi.object({
	author: Joi.string().pattern(new RegExp("^[a-zA-Z] ^[a-zA-Z]")).required(),

	message: Joi.min(3).required(),
	ts: Joi.required(),
});

const loadFiles = async () => {
	let dirpath = "./messages";
	fs.readdir(dirpath, function (err, files) {
		if (err) {
			console.log("error reading directory: " + err);
		} else {
			files.forEach((item) => {
				// la idea es cargar mensajes JSON guardados en /messages
				let filepath = dirpath + "/" + item;
				let content = fs.readFile(
					filepath,
					{ encoding: "utf8" },
					(err, data) => {
						if (err) {
							console.log("error reading directory: " + err);
						} else {
							if (data) {
								loadMessage(JSON.parse(data));
							}
						}
					}
				);
			});
		}
	});
};
loadFiles();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render(ejs.render("index"));
});

router.get("/chat/api/messages", function (req, res, next) {
	/* uso ejs porque si no me lanzaba error de que no hay motor de plantillas, tampoco supe mandar parametros sin ejs, sorry*/
	loadFiles().then(() => {
		res.status(200).render("messages", { messages: messagelist });
	});
	/* tampoco entendí como enviar el html Y los mensajes al tiempo distinguiendo ambos GET dentro del websocket */
});

router.get("/chat/api/messages/:ts", function (req, res, next) {
	//TODO: mostrar el mensaje con el timestamp req.params.ts
	let msgts = parseInt(req.params.ts);
	if (messagelist.has(msgts)) {
		res.render("singleMessage", { message: messagelist.get(msgts) });
	} else {
		res.status(404).send("mensaje no encontrado");
	}
});

router.post("/chat/api/messages", function (req, res, next) {
	//TODO: crear un mensaje
	let { error, value } = schema.validate(req.body);
	saveMessage(req.body);
	res.status(200).send(req.body);
});

router.put("/chat/api/messages/:ts", function (req, res, next) {
	//TODO: actualizar un mensaje
	let ts = parseInt(req.params.ts);
	let msgObj = req.body;
	if (messagelist.has(ts)) {
		messagelist.set(ts, msgObj);
		saveMessage(req.body);
		res.status(200).send(req.body);
	} else {
		res.status(404).send("mensaje no encontrado");
	}
});

router.delete("/chat/api/messages/:ts", function (req, res, next) {
	let ts = parseInt(req.params.ts);
	if (messagelist.has(ts)) {
		messagelist.delete(ts);
		deleteMessage(ts);
		res.status(200).send("eliminado correctamente");
	} else {
		res.status(404).send("mensaje no encontrado");
	}
});

function loadMessage(message) {
	messagelist.set(message.ts, message);
	return message;
}

function saveMessage(message /* en JSON */) {
	/* no se podrían crear mensajes al mismo milisegundos*/
	messagelist.set(message.ts, message);
	let dirpath = "./messages/";
	let filename = message.ts + ".json";
	fs.writeFile(dirpath + filename, JSON.stringify(message));
}

function deleteMessage(message /* timestamp del mensaje */) {
	let dirpath = "./messages/";
	let filename = message + ".json";
	fs.unlink(dirpath + filename);
}

module.exports = router;
