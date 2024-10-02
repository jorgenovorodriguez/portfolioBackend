require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 4000,
    },

    mysql: {
        host: process.env.MYSQL_HOST || '127.0.0.1',
        user: process.env.MYSQL_USER || 'demo',
        password: process.env.MYSQL_PASSWORD || 123456,
        database: process.env.MYSQL_DATABASE || 'portfolio',
        port: process.env.MYSQL_PORT || 3306,
    },
};
