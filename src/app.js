const express = require('express');
const config = require('./config');
const cors = require('cors');
const { initI18next } = require('./i18');

const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar i18next
initI18next(app);

// Configuración
app.set('port', config.app.port);

// Rutas
app.use(routes);

module.exports = app;
