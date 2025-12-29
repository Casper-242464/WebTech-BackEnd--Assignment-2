const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// VIEW ENGINE SETUP, STATIC FILES
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// IMPORTS
const weatherRoutes = require('./routes/weatherRoutes');
const logger = require('./middleware/logger');

// MIDDLEWARE LOGGER
app.use(logger);

// ROUTES
app.use('/', weatherRoutes);

// START SERVER
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});