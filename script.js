const apiKey = '3161f864e20f346c32a060dbdf459380';
const apiBaseUrl = 'https://api.weatherstack.com/current';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');
const loader = document.getElementById('loader');

// Elements to update
const cityNameEl = document.getElementById('cityName');
const countryNameEl = document.getElementById('countryName');
const localTimeEl = document.getElementById('localTime');
const weatherIconEl = document.getElementById('weatherIcon');
const temperatureEl = document.getElementById('temperature');
const weatherDescEl = document.getElementById('weatherDescription');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const feelsLikeEl = document.getElementById('feelsLike');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

async function fetchWeather(city) {
    // Show loader, hide error/card
    loader.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    errorMessage.classList.add('hidden');

    try {
        const url = `${apiBaseUrl}?access_key=${apiKey}&query=${encodeURIComponent(city)}`;
        const response = await fetch(url);
        const data = await response.json();

        loader.classList.add('hidden');

        if (data.error) {
            showError("City not found. Please try again or check the spelling.");
            console.error("API Error:", data.error);
        } else {
            updateUI(data);
        }
    } catch (error) {
        loader.classList.add('hidden');
        showError("Unable to fetch weather data. Please check your connection.");
        console.error("Fetch Error:", error);
    }
}

function updateUI(data) {
    const current = data.current;
    const location = data.location;

    cityNameEl.textContent = location.name;
    countryNameEl.textContent = location.country;

    // Format local time: "2023-10-27 10:30" -> "10:30"
    // Or just display as returned
    localTimeEl.textContent = `Local Time: ${location.localtime.split(' ')[1]}`;

    temperatureEl.textContent = current.temperature;
    weatherDescEl.textContent = current.weather_descriptions[0];
    weatherIconEl.src = current.weather_icons[0];

    humidityEl.textContent = `${current.humidity}%`;
    windSpeedEl.textContent = `${current.wind_speed} km/h`;
    feelsLikeEl.textContent = `${current.feelslike}°C`;

    weatherCard.classList.remove('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}
