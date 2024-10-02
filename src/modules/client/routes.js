const express = require('express');
const router = express.Router();
const responses = require('../../network/responses');
const getExpController = require('../../controllers/getExpController');
const saveMessage = require('../../controllers/postMesController');

router.get('/', async (req, res) => {
    try {
        const data = await getExpController.getDataExperience();
        responses.success(req, res, data, 200);
    } catch (error) {
        responses.error(req, res, 'Error al obtener los datos', 500);
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await saveMessage.saveMessage();
        responses.success(req, res, data, 200);
    } catch (error) {
        responses.error(req, res, 'Error al guardar los datos', 500);
    }
});

/* router.post('/messages', saveMessage); */

module.exports = router;
