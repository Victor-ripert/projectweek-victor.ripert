const dotenv = require('dotenv');
const mysql = require('mysql2');

// Create a pooled connection; supports both callbacks and the promise wrapper via .promise()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log("Failed to connect to the database", err);
        return;
    }
    console.log("Connected successfully to the database");
    connection.release();
});

module.exports = pool;