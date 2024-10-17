const express = require('express');
const router = express.Router();
const getExpController = require('../controllers/getExpController');
const saveMessage = require('../controllers/postMesController');
const getDataProjects = require('../controllers/getProjectController');
const downloadPdf = require('../controllers/downloadPdfController');

router.get('/api/experience', getExpController.getDataExperience);
router.post('/api/message', saveMessage.saveMessage);
router.get('/api/projects', getDataProjects.getDataProjects);
router.get('/api/download', downloadPdf.downloadPdf);

module.exports = router;
