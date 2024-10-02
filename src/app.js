const express = require('express');
const config = require('./config');
const cors = require('cors');
const { getDataExperience } = require('./controllers/getExpController');
const { saveMessage } = require('./controllers/postMesController');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
app.set('port', config.app.port);

// Routes
app.get('/api/experience', getDataExperience);
app.use('/api/message', saveMessage);

module.exports = app;
