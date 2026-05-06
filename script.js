const cityInput = document.querySelector('.city-input');
const welcomeSearchBtn = document.querySelector('.welcome-search-btn');
const searchBtn = document.querySelector('.search-btn');
const countryInput = document.querySelector('.country-input');

const weatherWelcome = document.querySelector('.weather-welcome');
const weatherInput = document.querySelector('.weather-input');
const weatherText = document.querySelector('.weather-text');
const errorMsg = document.querySelector('.error-msg');
const weatherError = document.querySelector('.weather-error-msg');

const cityTxt = document.querySelector('.city-txt');
const weatherDay = document.querySelector('.weather-day');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value-txt');
const windTxt = document.querySelector('.wind-value-txt');
const weatherImg = document.querySelector('.weather-summary-img');

const futureWeather = document.querySelector('.future-weather');
const todayTxt = document.querySelector('.today-txt');


const apiKey = '5fd9094f4742b02276d974ee0f156d43';

welcomeSearchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);

        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);

        cityInput.value = '';
        cityInput.blur();
    }
});

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);

        cityInput.value = '';
        cityInput.blur();
    }
});

countryInput.addEventListener('keypress', (event) => {
    if (event.key == 'Enter' && countryInput.value.trim() !== '') {
        updateWeatherInfo(countryInput.value);

        countryInput.value = '';
        countryInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) { return 'thunderstorm.svg'};
    if (id <= 321) { return 'drizzle.svg'};
    if (id <= 531) { return 'rain.svg'};
    if (id <= 622) { return 'snow.svg'};
    if (id <= 781) { return 'atmosphere.svg'};
    if (id <= 800) { return 'clear.svg'}
    else { return 'clouds.svg'};
}

function getCurrentDay() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };

    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    const welcomeDisplay = window.getComputedStyle(weatherWelcome).display;

    console.log(welcomeDisplay)

    if (weatherData.cod != 200) {
        if(welcomeDisplay === 'none') {
            hideSections();
            weatherInput.style.display = 'flex';
            weatherText.style.display = 'flex';
            weatherError.style.display = 'block';
            return
        } else {
            hideSections();
            weatherWelcome.style.display = 'flex';
            errorMsg.style.display = 'block';
            return
        }
    }

    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData;

    cityTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityTxt.textContent = humidity + '%';
    windTxt.textContent = speed + ' M/s';

    weatherDay.textContent = getCurrentDay();
    weatherImg.src = `assets/weather/${getWeatherIcon(id)}`;
    todayTxt.textContent = getTodayLabel(id);

    await updateForecastsInfo(city);

    hideSections();
    weatherError.style.display = 'none';
    weatherInput.style.display = 'flex';
    weatherText.style.display = 'flex';
}

async function updateForecastsInfo(city) {
    const forecastData = await getFetchData('forecast', city);

    const timeTaken = '12:00:00';
    /* const todayDate = new Date().toISOString().split('T')[0]; */
    const localISO = new Date().toLocaleDateString('en-CA');

    futureWeather.innerHTML = '';

    forecastData.list.forEach(forecastWeather =>{
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(localISO)) {
            console.log(forecastWeather);
            updateForecastItems(forecastWeather);
        }
    });
}

function getTodayLabel(id) {
    if (id <= 232) { return "Expect heavy rain and lightning."};
    if (id <= 321) { return "It's a bit misty out there."};
    if (id <= 531) { return "Don't forget your umbrella!"};
    if (id <= 622) { return "Wrap up warm, it's snowing!"};
    if (id <= 781) { return "Visibility is low today."};
    if (id <= 800) { return "The sun is out in full force!"}
    else { return "The clouds are rolling in."};
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    };
    const dateResult = dateTaken.toLocaleDateString('en-CA', dateOption);

    const forecastItem =   `
        <div class="future-weather-card">
            <h2 class="forecast-item-date">${dateResult}</h2>
            <img src="assets/weather/${getWeatherIcon(id)}" alt="Weather Icon" class="forecast-item-img">
            <h3 class="forecast-item-temp">${Math.round(temp)} °C</h3>
        </div>
    `;

    futureWeather.insertAdjacentHTML('beforeend', forecastItem)
}
//NEWS
function hideSections() {
    [weatherWelcome, weatherInput, weatherText, errorMsg]
        .forEach(section =>  { if(section) section.style.display = 'none' });
} 

function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let content of tabContents) {
        content.classList.remove("active");
    }

    const tabBtns = document.getElementsByClassName("tab-btn");
    for (let btn of tabBtns) {
        btn.classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

const gNewsKey = 'b191775e33206f1ceca77fdad1df3e3c'; 

async function updateGNews() {
    const query = encodeURIComponent('typhoon OR "weather update" OR LPA OR climate');
    const url = `https://gnews.io/api/4/search?q=${query}&lang=en&country=ph&max=1&apikey=${gNewsKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            const article = data.articles[0];
            
            document.getElementById('news-title').textContent = article.title;
            document.getElementById('news-desc').textContent = article.description;
            
            const newsImg = document.getElementById('news-img-element');
            if (newsImg) {
                newsImg.src = article.image;
                newsImg.alt = article.title;
            }

            document.getElementById('news-title').innerHTML = 
                `<a href="${article.url}" target="_blank" style="text-decoration:none; color:inherit;">${article.title}</a>`;
        }
    } catch (error) {
        console.error("GNews Fetch Error:", error);
        document.getElementById('news-title').textContent = "Unable to load news.";
    }
}

window.addEventListener('DOMContentLoaded', updateGNews);
// END NEWS 