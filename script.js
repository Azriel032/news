// =========================
// INPUTS & UI ELEMENTS
// =========================
const cityInput = document.querySelector('.city-input');
const welcomeSearchBtn = document.querySelector('.welcome-search-btn');
const searchBtn = document.querySelector('.search-btn');
const countryInput = document.querySelector('.country-input');

const weatherWelcome = document.querySelector('.weather-welcome');
const weatherInput = document.querySelector('.weather-input');
const weatherText = document.querySelector('.weather-text');
const tipsSection = document.getElementById('tips');

const errorMsg = document.querySelector('.error-msg');
const weatherError = document.querySelector('.weather-error-msg');

// Weather Info Display
const cityTxt = document.querySelector('.city-txt');
const weatherDay = document.querySelector('.weather-day');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value-txt');
const windTxt = document.querySelector('.wind-value-txt');
const weatherImg = document.querySelector('.weather-summary-img');
const futureWeather = document.querySelector('.future-weather');
const todayTxt = document.querySelector('.today-txt');

// Tips Section Display
const tipsTemp = document.querySelector('.tips-temp');
const tipsCondition = document.querySelector('.tips-condition');
const tipsIcon = document.querySelector('.about-weather-icon');
const dangerTitle = document.querySelector('.danger-title');
const dangerDescription = document.querySelector('.danger-description');
const tipsMainTitle = document.querySelector('.tips-main-title');
const tipsList = document.querySelector('.tips-list');

// =========================
// CONFIGURATION
// =========================
const apiKey = '5fd9094f4742b02276d974ee0f156d43';
const newsDataKey = 'pub_df285ec6a85c42d4a489460e4c019f87';

const shelterData = {
    Manila: [
        {
            name: 'Manila Science High School',
            image: 'assets/shelters/manila.jpg'
        },
        {
            name: 'Rizal Park Evacuation Center',
            image: 'assets/shelters/rizal.jpg'
        },
        {
            name: 'Delpan Evacuation Center',
            image: 'assets/shelters/delp.jpg'
        },
        {
            name: 'Baseco Evacuation Center',
            image: 'assets/shelters/baseco.jpg'
        }
    ],

    Pasig: [
        {
            name: 'Pasig Mega Market Shelter',
            image: 'assets/shelters/default.jpg'
        },
        {
            name: 'Rosario Sports Complex',
            image: 'assets/shelters/default.jpg'
        }
    ]
};

// =========================
// SEARCH LOGIC
// =========================
function handleSearch(event) {

    let input;

    // Detect active input
    if (event?.target) {
        input = event.target
            .closest('.weather-input-container')
            ?.querySelector('input');
    }

    // fallback
    if (!input) {
        input = document.activeElement === countryInput
            ? countryInput
            : cityInput;
    }

    const city = input.value.trim();

    if (!city) return;

    updateWeatherInfo(city);

    // Clear inputs
    cityInput.value = '';
    countryInput.value = '';

    input.blur();
}

// Search buttons
[welcomeSearchBtn, searchBtn].forEach(btn => {
    if (btn) {
        btn.addEventListener('click', handleSearch);
    }
});

// Enter key
[cityInput, countryInput].forEach(input => {
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch(e);
            }
        });
    }
});

// =========================
// API & DATA HELPERS
// =========================
async function getFetchData(endPoint, city) {

    const apiUrl =
        `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    return response.json();
}

function getWeatherIcon(id) {

    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id == 800) return 'clear.svg';

    return 'clouds.svg';
}

function getTodayLabel(id) {

    if (id <= 232) return "Thunderstorms are expected today.";
    if (id <= 321) return "Light rain showers are present.";
    if (id <= 531) return "It's a rainy day today.";
    if (id <= 622) return "Snowy conditions ahead.";
    if (id <= 781) return "Foggy atmosphere detected.";
    if (id == 800) return "The sun is out in full force!";

    return "Cloudy skies today.";
}

// =========================
// MAIN WEATHER UPDATE
// =========================
async function updateWeatherInfo(city) {

    const weatherData = await getFetchData('weather', city);

    if (weatherData.cod != 200) {
        showErrorState();
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;

    // Update Weather UI
    cityTxt.textContent = country;
    tempTxt.textContent = `${Math.round(temp)} °C`;
    conditionTxt.textContent = main;
    humidityTxt.textContent = `${humidity}%`;
    windTxt.textContent = `${speed} M/s`;

    weatherDay.textContent = new Date().toLocaleDateString(
        'en-GB',
        {
            weekday: 'short',
            day: '2-digit',
            month: 'short'
        }
    );

    weatherImg.src = `assets/weather/${getWeatherIcon(id)}`;

    todayTxt.textContent = getTodayLabel(id);

    // Update Tips
    updateTipsSection(id, temp, country, main);

    // Update Forecast
    await updateForecastsInfo(city);

    // Show Sections
    hideAllSections();

    weatherInput.style.display = 'flex';
    weatherText.style.display = 'flex';

    tipsSection.classList.add('show');
}

// =========================
// TIPS SECTION
// =========================
function updateTipsSection(id, temp, city, condition) {

    tipsTemp.textContent = `${Math.round(temp)}°C`;

    tipsCondition.textContent = condition;

    tipsIcon.src =
        `assets/weather/${getWeatherIcon(id)}`;

    let title;
    let description;
    let tips;
    let alertColor;

    // =========================
    // WEATHER STATES
    // =========================

    if (temp >= 32) {

        title = 'Extreme Heat Advisory';

        description =
            'Very high temperatures may cause dehydration and heat exhaustion.';

        alertColor = '#F97316';

        tips = [
            'Drink plenty of water.',
            'Avoid outdoor activities at noon.',
            'Wear light clothing.',
            'Use sunscreen.'
        ];

    }

    else if (id <= 232) {

        title = 'Thunderstorm Warning';

        description =
            'Thunderstorms may include lightning and strong winds.';

        alertColor = '#7C3AED';

        tips = [
            'Stay indoors.',
            'Avoid open areas.',
            'Charge devices early.',
            'Unplug appliances.'
        ];

    }

    else if (id <= 531) {

        title = 'Rainfall Advisory';

        description =
            'Rain may cause slippery roads and flooding.';

        alertColor = '#2563EB';

        tips = [
            'Bring an umbrella.',
            'Avoid flooded streets.',
            'Drive carefully.',
            'Prepare emergency supplies.'
        ];

    }

    else {

        title = 'Normal Weather Advisory';

        description =
            'Weather conditions are generally stable today.';

        alertColor = '#0EA5E9';

        tips = [
            'Stay hydrated.',
            'Monitor forecasts.',
            'Enjoy your day safely.'
        ];
    }

    // =========================
    // UPDATE ALERT CARD
    // =========================

    dangerTitle.textContent = title;

    dangerDescription.textContent = description;

    document.querySelector('.tips-alert')
        .style.borderLeft =
        `6px solid ${alertColor}`;

    tipsMainTitle.textContent =
        getTodayLabel(id);

    // =========================
    // TIPS LIST
    // =========================

   tipsList.innerHTML =
    tips.map(tip => `

    <li>${tip}</li>

    `).join('');

    // =========================
    // SHELTERS
    // =========================

    const shelterGrid =
        document.querySelector('.shelter-grid');

    shelterGrid.innerHTML = '';

    const cityShelters =
        shelterData[city];

    if (cityShelters) {

        cityShelters.forEach(shelter => {

    shelterGrid.innerHTML += `

    <div class="shelter-card">

        <img
            src="${shelter.image}"
            alt="${shelter.name}"
        >

        <div class="shelter-info">

            <h3>${shelter.name}</h3>

        </div>

    </div>
    `;
});

    }

    else {

        shelterGrid.innerHTML = `

        <div class="shelter-card">

            <div class="shelter-info">

                <h3>No Shelter Data</h3>

                <p>
                    No local shelters listed
                    for this area.
                </p>

            </div>

        </div>
        `;
    }
}

// =========================
// FORECAST SECTION
// =========================
async function updateForecastsInfo(city) {

    const forecastData = await getFetchData('forecast', city);

    const timeTaken = '12:00:00';

    const localISO = new Date().toLocaleDateString('en-CA');

    futureWeather.innerHTML = '';

    forecastData.list.forEach(forecast => {

        if (
            forecast.dt_txt.includes(timeTaken) &&
            !forecast.dt_txt.includes(localISO)
        ) {

            const dateResult =
                new Date(forecast.dt_txt)
                    .toLocaleDateString(
                        'en-GB',
                        {
                            day: '2-digit',
                            month: 'short'
                        }
                    );

            futureWeather.innerHTML += `
                <div class="future-weather-card">

                    <h2 class="forecast-item-date">
                        ${dateResult}
                    </h2>

                    <img
                        src="assets/weather/${getWeatherIcon(forecast.weather[0].id)}"
                        class="forecast-item-img"
                    >

                    <h3 class="forecast-item-temp">
                        ${Math.round(forecast.main.temp)} °C
                    </h3>

                </div>
            `;
        }
    });
}

// =========================
// UI HELPERS
// =========================
function hideAllSections() {

    [
        weatherWelcome,
        weatherInput,
        weatherText,
        errorMsg,
        weatherError
    ].forEach(section => {

        if (section) {
            section.style.display = 'none';
        }
    });

    tipsSection.classList.remove('show');
}

function showErrorState() {

    const wasInWeatherScreen =
        weatherText.style.display === 'flex';

    hideAllSections();

    if (wasInWeatherScreen) {

        weatherInput.style.display = 'flex';
        weatherError.style.display = 'block';

    } else {

        weatherWelcome.style.display = 'flex';
        errorMsg.style.display = 'block';
    }
}

// =========================
// NEWS SECTION
// =========================
async function updateClimateNews() {

    const currentUrl =
        `https://newsdata.io/api/1/news?apikey=${newsDataKey}&q=typhoon OR flood OR climate&country=ph&language=en&category=environment`;

    try {

        const response = await fetch(currentUrl);

        const data = await response.json();

        const currentGrid =
            document.querySelector('#current-news .news-grid');

        if (currentGrid && data.results) {

            currentGrid.innerHTML =
                data.results.slice(0, 3).map(article => `

                <div class="news-card">

                    <div class="news-img-wrapper">

                        <img src="${article.image_url || 'assets/icons/News-Placeholder.png'}">

                        <span class="badge current-badge">
                            CURRENT NEWS
                        </span>

                    </div>

                    <div class="news-card-body">

                        <h3>${article.title}</h3>

                        <p>
                            ${
                                article.description
                                    ? article.description.substring(0, 100) + '...'
                                    : 'Climate updates available.'
                            }
                        </p>

                        <a
                            href="${article.link}"
                            target="_blank"
                            class="read-more"
                        >
                            READ FULL STORY >
                        </a>

                    </div>

                </div>

            `).join('');
        }

    } catch (e) {

        console.error('News Error:', e);
    }
}

// =========================
// TABS
// =========================
function openTab(evt, tabName) {

    Array.from(
        document.getElementsByClassName('tab-content')
    ).forEach(c => c.classList.remove('active'));

    Array.from(
        document.getElementsByClassName('tab-btn')
    ).forEach(b => b.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');

    evt.currentTarget.classList.add('active');
}

// =========================
// INITIAL LOAD
// =========================
document.addEventListener(
    'DOMContentLoaded',
    updateClimateNews
);