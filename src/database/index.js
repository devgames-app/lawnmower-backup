const config = require("../config");
const mysql = require("mysql2");

const mysqlAccounts = mysql.createConnection(config.mysql);
const mysqlUser = mysql.createConnection(config.mysql);

module.exports = { mysqlAccounts, mysqlUser };
