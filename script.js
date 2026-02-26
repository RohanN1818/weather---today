const apiKey = "20c68995b1ef64c9a96931faa88caa22";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        getForecast(city);
    }
});

async function getWeather(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = Math.round(data.main.temp) + "°C";
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("feelsLike").textContent = data.main.feels_like + "°C";
    document.getElementById("humidity").textContent = data.main.humidity + "%";
    document.getElementById("windSpeed").textContent = data.wind.speed + " km/h";

    const icon = data.weather[0].icon;
    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${icon}@4x.png`;

    const now = new Date();
    document.getElementById("dateTime").textContent =
        now.toDateString() + " | " + now.toLocaleTimeString();
}

async function getForecast(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.slice(0, 5).forEach(day => {
        const date = new Date(day.dt_txt);

        const card = `
            <div class="forecast-card">
                <h4>${date.toLocaleDateString('en-US', { weekday: 'long' })}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                <p>${Math.round(day.main.temp)}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;

        forecastContainer.innerHTML += card;
    });
}
