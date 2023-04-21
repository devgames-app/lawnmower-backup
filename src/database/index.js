const config = require("../config");
const mysql = require("mysql2");

const mysqlAccounts = mysql.createConnection(config.mysqlAccounts);
const mysqlUser = mysql.createConnection(config.mysqlUser);

module.exports = { mysqlAccounts, mysqlUser };
