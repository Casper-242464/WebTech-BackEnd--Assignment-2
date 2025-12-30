const axios = require('axios');
const API_KEY = '86485b1dcfa2b6e61f076ae785873115';
const API_URL = 'http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=' + API_KEY;

exports.getWeatherData = async () => {
    try {
        const response = await axios.get(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);

        return {
            icon: response.data.weather[0].icon,
            city: response.data.name,
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            coordinates: response.data.coord,
            feels_like: response.data.main.feels_like,
            humidity: response.data.main.humidity,
            wind_speed: response.data.wind.speed,
            rain_volume: response.data.rain ? response.data.rain['1h'] : 0
        }
    }
    catch (error) {
        console.error('Error fetching OpenWeatherMap data:', error);
        throw error;
    };
}