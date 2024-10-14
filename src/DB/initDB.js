require('dotenv').config();
const getDB = require('./getDB');

const main = async () => {
    let connection;

    try {
        connection = await getDB();

        await connection.query('DROP TABLE IF EXISTS history');
        await connection.query('DROP TABLE IF EXISTS messages');
        await connection.query('DROP TABLE IF EXISTS projects');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS history (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                role VARCHAR(50) NOT NULL,
                organisation VARCHAR(50) NOT NULL,
                startDate DATE NOT NULL,
                endDate DATE NOT NULL,
                experiences VARCHAR(500) NOT NULL,
                imageSrc VARCHAR(50) NOT NULL,
                link VARCHAR(50) NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT NOW()
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL,
                email VARCHAR(50) NOT NULL,
                message VARCHAR(500) NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT NOW()
            )    
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(50) NOT NULL,
                category VARCHAR(50) NOT NULL,
                imageSrc VARCHAR(50) NOT NULL,
                description TEXT NOT NULL,
                skills JSON NOT NULL,
                gitLinkFront VARCHAR(255) NOT NULL,
                gitLinkBack VARCHAR(255),
                createdAt DATETIME NOT NULL DEFAULT NOW()
            )
        `);

        console.log('Tables created');
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
};

main();
