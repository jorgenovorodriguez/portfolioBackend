const mysql = require('mysql2/promise');

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DATABASE } = process.env;

let pool;

const getDB = async () => {
    try {
        if (!pool) {
            pool = mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                database: MYSQL_DATABASE,
                timezone: 'Z',
            });

            const connection = await pool.getConnection();
            await connection.query(
                `CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE}`
            );
            connection.release();
        }

        return await pool.getConnection();
    } catch (error) {
        console.error('Error getting connection:', error);
    }
};

module.exports = getDB;
