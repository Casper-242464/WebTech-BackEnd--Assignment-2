const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const weatherService = require('../services/weatherService');


router.get('/', (req, res) => {
    res.render('index');
});

// Get weather data for a city
router.get('/weather', async (req, res) => {
    const address = req.query.address;
    if(!address) return res.status(400).json({ error: 'address query required' });
    try{
        const data = await weatherService.getWeatherData(address);
        res.json(data);
    }catch(err){
        res.status(500).json({ error: 'Unable to fetch weather' });
    }
});

// Favorites API
router
    .route('/api/weather')
        .get(weatherController.returnFavorites)
        .post(weatherController.addFavorite)
        .put(weatherController.updateFavoriteList);

router
    .route('/api/weather/:city')
        .get(weatherController.getCityWeather)
        .delete(weatherController.deleteFromFavorites);

module.exports = router;