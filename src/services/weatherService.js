const axios = require('axios');
const API_KEY = process.env.OPENWEATHER_API_KEY;
const API_URL = 'http://api.openweathermap.org/data/2.5/weather';

if (!API_KEY) {
    throw new Error('OPENWEATHER_API_KEY environment variable is required');
}

exports.getWeatherData = async (city) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        const d = response.data;
        let description = d.weather && d.weather[0] ? d.weather[0].description : '';
        // Capitalize description
        if (description) {
            description = description.charAt(0).toUpperCase() + description.slice(1);
        }

        return {
            icon: d.weather && d.weather[0] ? `http://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png` : null,
            city: d.name,
            temperature: d.main && d.main.temp,
            description: description,
            coordinates: d.coord,
            feels_like: d.main && d.main.feels_like,
            humidity: d.main && d.main.humidity,
            wind_speed: d.wind && d.wind.speed,
            rain_volume: d.rain ? d.rain['1h'] || 0 : 0
        };
    }
    catch (error) {
        console.error('Error fetching OpenWeatherMap data:', error.message || error);
        throw error;
    }
}