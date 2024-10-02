const getDB = require('../DB/getDB');

const TABLE = 'history';

const getDataExperience = async (req, res) => {
    let connection;
    try {
        connection = await getDB();
        const [rows] = await connection.query(`SELECT * FROM ${TABLE}`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    getDataExperience,
};
