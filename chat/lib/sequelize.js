const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("chat", "", "", {
	dialect: "sqlite",
	storage: "./database/chat.sqlite",
});

sequelize.authenticate().then(() => {
	console.log("succesful db connection.");
});

module.exports = sequelize;
