const fs = require('fs').promises;
const path = require('path');
const weatherService = require('../services/weatherService');

const DATA_FILE = path.join(__dirname, '..', 'data', 'favorites.json');

async function readFavorites(){
	try{
		const txt = await fs.readFile(DATA_FILE, 'utf8');
		return JSON.parse(txt || '[]');
	}catch(e){
		return [];
	}
}

async function writeFavorites(list){
	await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

// GET
// Returns weather data for all cities in the "favorites" list.
exports.returnFavorites = async (req, res) => {
	try{
		const favs = await readFavorites();
		const results = [];
		for(const city of favs){
			try{
				const w = await weatherService.getWeatherData(city);
				results.push({ city, weather: w });
			}catch(e){
				results.push({ city, error: 'failed to fetch' });
			}
		}
		res.json({ favorites: results });
	}catch(err){
		res.status(500).json({ error: 'Unable to read favorites' });
	}
};
// POST
// Adds a new city to the "favorites" list and retrieves weather data for it.
exports.addFavorite = async (req, res) => {
	const city = (req.body.city || req.body.address || '').trim();
	if(!city) return res.status(400).json({ error: 'city is required' });

	try{
		const favs = await readFavorites();
		if(!favs.includes(city)){
			favs.push(city);
			await writeFavorites(favs);
		}
		const weather = await weatherService.getWeatherData(city);
		res.status(201).json({ city, weather });
	}catch(err){
		res.status(500).json({ error: 'Failed to add favorite' });
	}
};


// WEATHER/CITY


// GET
// Returns weather data for a specific city from the "favorites" list.
exports.getCityWeather = async (req, res) => {
	const city = req.params.city;
	if(!city) return res.status(400).json({ error: 'city required' });
	try{
		const weather = await weatherService.getWeatherData(city);
		res.json({ city, weather });
	}catch(err){
		res.status(500).json({ error: 'Failed to fetch weather' });
	}
};
// PUT
// Changes the position of a city in the "favorites" list.
exports.updateFavoriteList= async (req, res) => {
	// expecting { city, newIndex }
	const { city, newIndex } = req.body || {};
	if(!city || typeof newIndex !== 'number') return res.status(400).json({ error: 'city and newIndex required' });
	try{
		const favs = await readFavorites();
		const idx = favs.indexOf(city);
		if(idx === -1) return res.status(404).json({ error: 'city not found' });
		favs.splice(idx,1);
		favs.splice(newIndex,0,city);
		await writeFavorites(favs);
		res.json({ favorites: favs });
	}catch(err){
		res.status(500).json({ error: 'Failed to update favorites' });
	}
};
// DELETE
// Removes a city from the "favorites" list.
exports.deleteFromFavorites = async (req, res) => {
	const city = req.params.city;
	if(!city) return res.status(400).json({ error: 'city required' });
	try{
		const favs = await readFavorites();
		const filtered = favs.filter(c => c.toLowerCase() !== city.toLowerCase());
		await writeFavorites(filtered);
		res.json({ favorites: filtered });
	}catch(err){
		res.status(500).json({ error: 'Failed to delete favorite' });
	}
};