import { config } from '@/server/config';
const mysql = require('mysql2');

export const mysqlAccounts = mysql.createConnection(config.mysqlAccounts);
export const mysqlUser = mysql.createConnection(config.mysqlUser);
