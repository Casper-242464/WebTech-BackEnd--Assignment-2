const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


const weatherRoutes = require('./routes/weatherRoutes');

app.use('/', weatherRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});