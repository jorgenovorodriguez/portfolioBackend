const express = require('express');
const config = require('./config');
const app = require('./app');

const PORT = config.app.port;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
