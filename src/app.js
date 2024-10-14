const express = require('express');
const config = require('./config');
const cors = require('cors');
const { initI18next } = require('./i18');

const { getDataExperience } = require('./controllers/getExpController');
const { saveMessage } = require('./controllers/postMesController');
const { getDataProjects } = require('./controllers/getProjectController');

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar i18next
initI18next(app);

// Configuración
app.set('port', config.app.port);

// Rutas
app.get('/api/experience', getDataExperience);
app.get('/api/projects', getDataProjects);
app.use('/api/message', saveMessage);

module.exports = app;
