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

let isLoading = false; // 🔥 Prevent multiple requests

searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (isLoading) return; // 🚫 Ignore if already loading

    fetchWeather(city);
}

async function fetchWeather(city) {
    isLoading = true;
    searchBtn.disabled = true;

    loader.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    errorMessage.classList.add('hidden');

    try {
        const url = `${apiBaseUrl}?access_key=${apiKey}&query=${encodeURIComponent(city)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            showError("City not found. Please try again.");
            console.error("API Error:", data.error);
        } else {
            updateUI(data);
        }
    } catch (error) {
        showError("Unable to fetch weather data. Please check your connection.");
        console.error("Fetch Error:", error);
    } finally {
        loader.classList.add('hidden');
        searchBtn.disabled = false;
        isLoading = false;
    }
}

function updateUI(data) {
    const current = data.current;
    const location = data.location;

    cityNameEl.textContent = location.name;
    countryNameEl.textContent = location.country;
    localTimeEl.textContent = `Local Time: ${location.localtime.split(' ')[1]}`;

    temperatureEl.textContent = `${current.temperature}°C`;
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
