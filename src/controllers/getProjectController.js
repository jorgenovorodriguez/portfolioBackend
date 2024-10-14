const getDB = require('../DB/getDB');
const i18next = require('i18next');
const { setLanguage } = require('../i18');

const TABLE = 'projects';

const getDataProjects = async (req, res) => {
    let connection;
    const language = req.headers['accept-language'];
    setLanguage(language);

    try {
        connection = await getDB();
        const [rows] = await connection.query(`SELECT * FROM ${TABLE}`);

        const translatedRows = rows.map((row) => ({
            ...row,
            title: i18next.t(row.title, { lng: language }),
            category: i18next.t(row.category, { lng: language }),
            description: i18next.t(row.description, { lng: language }),
            category: i18next.t(row.category, { lng: language }),
        }));

        res.status(200).json(translatedRows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
            error: i18next.t('Error fetching data'),
        });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    getDataProjects,
};
