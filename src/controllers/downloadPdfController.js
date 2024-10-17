const path = require('path');

const downloadPdf = (req, res) => {
    const filePath = path.join(
        __dirname,
        '../../public/JorgeNovoRodriguezCvDev.pdf'
    );
    res.download(filePath, 'JorgeNovoRodriguezCvDev.pdf', (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.error(req, res, 'Error al descargar el archivo', 500);
        }
    });
};

module.exports = { downloadPdf };
