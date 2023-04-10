const config = require("../config");
const mysql = require("mysql2");

const connection = mysql.createConnection(config.mysql);

module.exports = connection;
