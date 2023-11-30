const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: '221.138.161.26',
    user: 'admin',
    port: '3306',
    password: '0000',
    database: 'josephDB'
});

module.exports = {
    pool: pool
};