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
const newsDataKey = 'pub_df285ec6a85c42d4a489460e4c019f87';

// Helper to create HTML cards dynamically
function createCardHTML(article, type) {
    const isPast = type === 'past';
    const badgeClass = isPast ? 'historical-badge' : 'current-badge';
    const badgeText = isPast ? 'HISTORICAL CONTEXT' : 'CURRENT NEWS';
    
    // IMAGE LOGIC: Use article image, or a relevant Unsplash image as a fallback
    const fallbackTerm = encodeURIComponent(article.title.split(' ').slice(0,2).join(' '));
    const imageUrl = article.image_url || `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop`;

    return `
        <div class="news-card">
            <div class="news-img-wrapper">
                <img src="${imageUrl}" alt="${article.title}" onerror="this.src='https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800'">
                <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="news-card-body">
                <h3>${isPast ? 'PAST EVENT: ' : ''}${article.title}</h3>
                <p>${article.description ? article.description.substring(0, 100) + '...' : 'Global climate patterns continue to shift. Read more for full environmental impact analysis.'}</p>
                <a href="${article.link}" target="_blank" class="read-more">READ FULL STORY ></a>
            </div>
        </div>
    `;
}

async function updateClimateNews() {
    // 1. Fetch CURRENT News (Focused on SDG 13 Philippines)
    const currentUrl = `https://newsdata.io/api/1/news?apikey=${newsDataKey}&q=typhoon%20OR%20flood%20OR%20"climate%20action"&country=ph&language=en&category=environment`;

    try {
        const response = await fetch(currentUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const currentGrid = document.querySelector('#current-news .news-grid');
            currentGrid.innerHTML = ''; // Clear loading/static content
            
            const topArticles = data.results.slice(0, 3);
            topArticles.forEach(article => {
                currentGrid.innerHTML += createCardHTML(article, 'current');
            });

            // 2. Trigger "Past" search based on the first article's main keyword
            const firstWord = topArticles[0].title.split(' ')[0];
            fetchHistoricalMatch(firstWord);
        }
    } catch (err) {
        console.error("News API Error:", err);
    }
}

async function fetchHistoricalMatch(keyword) {
    const pastGrid = document.querySelector('#past-news .news-grid');
    pastGrid.innerHTML = '<p style="padding:20px;">Searching related historical records...</p>';

    // Since Archive is paid, we fetch "World" news with the same keyword to simulate a "Historical Comparison"
    // We use category 'top' to find significant past-reaching events
    const pastUrl = `https://newsdata.io/api/1/news?apikey=${newsDataKey}&q=${keyword}&language=en&category=environment&prioritydomain=top`;

    try {
        const response = await fetch(pastUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            pastGrid.innerHTML = '';
            // Display top 3 matching historical/global context articles
            data.results.slice(1, 4).forEach(article => {
                pastGrid.innerHTML += createCardHTML(article, 'past');
            });
        } else {
            pastGrid.innerHTML = '<p>No historical comparison available for this specific event.</p>';
        }
    } catch (err) {
        console.error("Past Fetch Error:", err);
    }
}

// Ensure the function runs when page loads
document.addEventListener('DOMContentLoaded', updateClimateNews);

// Tab Switching Logic (Keep your existing function)
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let content of tabContents) { content.classList.remove("active"); }
    const tabBtns = document.getElementsByClassName("tab-btn");
    for (let btn of tabBtns) { btn.classList.remove("active"); }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}


// END NEWS 