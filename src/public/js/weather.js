// Client-side weather script (moved from index.ejs)
(function(){
    function $(id){ return document.getElementById(id); }

    document.addEventListener('DOMContentLoaded', function(){
        const form = $('weather-form');
        const statusEl = $('status');
        const resultEl = $('result');
        const locationEl = $('location');
        const summaryEl = $('summary');
        const tempEl = $('temperature');
        const feelsEl = $('feels_like');
        const humidityEl = $('humidity');
        const windEl = $('wind');
        const rainEl = $('rain');
        const coordsEl = $('coords');
        const iconEl = $('icon');
        const addFavBtn = $('add-fav');
        const favListEl = $('fav-list');

        function showStatus(msg){ statusEl.textContent = msg; }

        function clearResult(){
            resultEl.classList.add('hidden');
            locationEl.textContent = '';
            summaryEl.textContent = '';
            tempEl.textContent = '';
            humidityEl.textContent = '';
            windEl.textContent = '';
            iconEl.src = '';
            iconEl.classList.add('hidden');
            if(addFavBtn) addFavBtn.classList.add('hidden');
        }

        function displayWeatherData(data, addressFallback){
            if(!data) return;
            const address = addressFallback || data.city || '';
            locationEl.textContent = address;
            summaryEl.textContent = data.description || '';
            tempEl.textContent = (data.temperature !== undefined) ? data.temperature + ' °C' : '';
            feelsEl && (feelsEl.textContent = (data.feels_like !== undefined) ? data.feels_like + ' °C' : '');
            humidityEl.textContent = (data.humidity !== undefined) ? data.humidity + ' %' : '';
            windEl.textContent = data.wind_speed || '';
            rainEl && (rainEl.textContent = (data.rain_volume !== undefined) ? data.rain_volume : '0');
            coordsEl && (coordsEl.textContent = data.coordinates ? (data.coordinates.lat + ', ' + data.coordinates.lon) : '');
            if(data.icon){ iconEl.src = data.icon; iconEl.classList.remove('hidden'); }
            if(addFavBtn){
                addFavBtn.classList.remove('hidden');
                addFavBtn.onclick = function(){
                    fetch('/api/weather', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ city: address })
                    }).then(r => r.json()).then(() => {
                        fetchFavorites();
                    }).catch(()=>{});
                };
            }
            resultEl.classList.remove('hidden');
        }

        if(!form) return;

        form.addEventListener('submit', function(e){
            e.preventDefault();
            const address = $('address').value.trim();
            if(!address) return;
            clearResult();
            showStatus('Loading...');

            fetch('/weather?address=' + encodeURIComponent(address)).then(function(res){
                return res.json();
            }).then(function(data){
                if(data.error){ showStatus(data.error); return; }
                showStatus('');
                displayWeatherData(data, address);
            }).catch(function(){
                showStatus('Unable to fetch weather.');
            });
        });

        // Favorites management
        async function fetchFavorites(){
            try{
                const res = await fetch('/api/weather');
                const json = await res.json();
                renderFavorites(json.favorites || []);
            }catch(e){
                // ignore
            }
        }

        function renderFavorites(list){
            if(!favListEl) return;
            favListEl.innerHTML = '';
            list.forEach((item, idx) => {
                const city = (typeof item === 'string') ? item : (item.city || (item.city && item.city.city) || (item.city && item.city.name) || (item.city && item.city.city));
                const li = document.createElement('li');
                li.className = 'fav-item';

                const left = document.createElement('div');
                left.style.display = 'flex';
                left.style.gap = '8px';
                const name = document.createElement('button');
                name.textContent = city;
                name.className = 'fav-name';
                name.style.background = 'transparent';
                name.style.border = 'none';
                name.style.cursor = 'pointer';
                name.style.fontWeight = '600';
                name.onclick = function(){
                    // fetch and display weather for this favorite
                    fetch('/weather?address=' + encodeURIComponent(city)).then(r=>r.json()).then(d=>{ if(!d.error) displayWeatherData(d, city); }).catch(()=>{});
                };

                left.appendChild(name);

                const controls = document.createElement('div');
                controls.style.display = 'flex';
                controls.style.gap = '6px';

                const up = document.createElement('button');
                up.textContent = '↑';
                up.title = 'Move up';
                up.onclick = function(){
                    const newIndex = Math.max(0, idx - 1);
                    fetch('/api/weather', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ city, newIndex }) }).then(()=>fetchFavorites()).catch(()=>{});
                };

                const down = document.createElement('button');
                down.textContent = '↓';
                down.title = 'Move down';
                down.onclick = function(){
                    const newIndex = idx + 1;
                    fetch('/api/weather', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ city, newIndex }) }).then(()=>fetchFavorites()).catch(()=>{});
                };

                controls.appendChild(up);
                controls.appendChild(down);

                const del = document.createElement('button');
                del.textContent = 'Remove';
                del.className = 'del-btn';
                del.onclick = function(){
                    fetch('/api/weather/' + encodeURIComponent(city), { method: 'DELETE' }).then(()=>fetchFavorites()).catch(()=>{});
                };

                li.appendChild(left);
                li.appendChild(controls);
                li.appendChild(del);
                favListEl.appendChild(li);
            });
        }

        // initial load
        fetchFavorites();
    });
})();
