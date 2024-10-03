const getDB = require('../DB/getDB');
const i18next = require('i18next');
const { setLanguage } = require('../i18');

const TABLE = 'history';

const getDataExperience = async (req, res) => {
    let connection;
    const language = req.headers['accept-language'];
    setLanguage(language);

    try {
        connection = await getDB();
        const [rows] = await connection.query(`SELECT * FROM ${TABLE}`);

        const translatedRows = rows.map((row) => ({
            ...row,
            role: i18next.t(row.role, { lng: language }),
            experiences: i18next.t(row.experiences, { lng: language }),
        }));

        res.status(200).json(translatedRows);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).json({
            error: i18next.t('Error al obtener los datos'),
        });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    getDataExperience,
};
