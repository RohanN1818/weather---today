const apiKey = "20c68995b1ef64c9a96931faa88caa22";
const apiBaseUrl = "https://api.openweathermap.org/data/2.5/weather";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherCard = document.getElementById("weatherCard");
const errorMessage = document.getElementById("errorMessage");
const loader = document.getElementById("loader");

const cityNameEl = document.getElementById("cityName");
const countryNameEl = document.getElementById("countryName");
const localTimeEl = document.getElementById("localTime");
const weatherIconEl = document.getElementById("weatherIcon");
const temperatureEl = document.getElementById("temperature");
const weatherDescEl = document.getElementById("weatherDescription");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("windSpeed");
const feelsLikeEl = document.getElementById("feelsLike");

searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        handleSearch();
    }
});

function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city name.");
        return;
    }
    fetchWeather(city);
}

async function fetchWeather(city) {
    loader.classList.remove("hidden");
    weatherCard.classList.add("hidden");
    errorMessage.classList.add("hidden");

    try {
        const url = `${apiBaseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            showError("City not found. Please check spelling.");
            loader.classList.add("hidden");
            return;
        }

        const data = await response.json();
        updateUI(data);

    } catch (error) {
        showError("Unable to fetch weather data. Check your connection.");
        console.error(error);
    } finally {
        loader.classList.add("hidden");
    }
}

function updateUI(data) {
    cityNameEl.textContent = data.name;
    countryNameEl.textContent = data.sys.country;

    const localTime = new Date((data.dt + data.timezone) * 1000);
    localTimeEl.textContent = "Local Time: " + localTime.toUTCString().slice(17, 22);

    temperatureEl.textContent = data.main.temp + "°C";
    weatherDescEl.textContent = data.weather[0].description;

    humidityEl.textContent = data.main.humidity + "%";
    windSpeedEl.textContent = data.wind.speed + " m/s";
    feelsLikeEl.textContent = data.main.feels_like + "°C";

    const iconCode = data.weather[0].icon;
    weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherCard.classList.remove("hidden");
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}
