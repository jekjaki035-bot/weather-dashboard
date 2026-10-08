const state = {
  lat: -6.2088,
  lon: 106.8456,
  city: 'Jakarta, Indonesia',
};

const weatherCodeMap = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Foggy', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  53: { label: 'Moderate Drizzle', icon: '🌦️' },
  55: { label: 'Heavy Drizzle', icon: '🌧️' },
  61: { label: 'Light Rain', icon: '🌦️' },
  63: { label: 'Moderate Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  71: { label: 'Light Snow', icon: '🌨️' },
  73: { label: 'Moderate Snow', icon: '🌨️' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  80: { label: 'Rain Showers', icon: '🌦️' },
  81: { label: 'Heavy Rain Showers', icon: '🌧️' },
  85: { label: 'Snow Showers', icon: '🌨️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with Hail', icon: '⛈️' },
  99: { label: 'Severe Thunderstorm', icon: '⛈️' },
};

let tempChart, humidityChart, windChart;

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', { weekday: 'short' });
}

function getWeatherIcon(code) {
  return weatherCodeMap[code]?.icon || '🌤️';
}

function getWeatherLabel(code) {
  return weatherCodeMap[code]?.label || 'Varied Weather';
}

function renderForecast(daily) {
  const grid = document.getElementById('forecastGrid');
  grid.innerHTML = daily.time
    .slice(0, 7)
    .map((date, index) => {
      const code = daily.weather_code[index];
      const icon = getWeatherIcon(code);
      const high = Math.round(daily.temperature_2m_max[index]);
      const low = Math.round(daily.temperature_2m_min[index]);
      const label = getWeatherLabel(code);

      return `
        <div class="forecast-item">
          <div class="forecast-day">${formatDay(date)}</div>
          <div class="forecast-icon">${icon}</div>
          <div class="forecast-temp-high">${high}°</div>
          <div class="forecast-temp-low">${low}°</div>
          <div class="forecast-label">${label}</div>
        </div>
      `;
    })
    .join('');
}

function renderHourly(hourly) {
  const start = hourly.time.findIndex((t) => new Date(t) > new Date());
  const grid = document.getElementById('hourlyGrid');
  const items = [];

  for (let i = 0; i < 12; i++) {
    const idx = start + i;
    if (idx >= hourly.time.length) break;

    const time = new Date(hourly.time[idx]);
    const code = hourly.weather_code[idx];
    const icon = getWeatherIcon(code);
    const temp = Math.round(hourly.temperature_2m[idx]);

    items.push(`
      <div class="hourly-item">
        <div class="hourly-time">${time.toLocaleTimeString([], { hour: '2-digit' })}</div>
        <div class="hourly-icon">${icon}</div>
        <div class="hourly-temp">${temp}°</div>
      </div>
    `);
  }

  grid.innerHTML = items.join('');
}

function renderCharts(data) {
  const labels = data.hourly.time.slice(0, 12).map((t) => new Date(t).toLocaleTimeString([], { hour: '2-digit' }));
  const tempData = data.hourly.temperature_2m.slice(0, 12);

  // Temperature Chart
  if (tempChart) tempChart.destroy();
  const tempCtx = document.getElementById('tempChart').getContext('2d');
  tempChart = new Chart(tempCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: t('temperatureTrend'),
        data: tempData,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { beginAtZero: false, ticks: { color: '#64748b' } },
      },
    },
  });

  // Humidity Chart
  if (humidityChart) humidityChart.destroy();
  const humidityCtx = document.getElementById('humidityChart').getContext('2d');
  humidityChart = new Chart(humidityCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: t('humidity'),
        data: data.hourly.relative_humidity_2m.slice(0, 12),
        backgroundColor: 'rgba(14, 165, 233, 0.6)',
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } },
    },
  });

  // Wind Chart
  if (windChart) windChart.destroy();
  const windCtx = document.getElementById('windChart').getContext('2d');
  windChart = new Chart(windCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: t('wind'),
        data: data.hourly.wind_speed_10m.slice(0, 12),
        borderColor: '#a78bfa',
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } },
    },
  });
}

function renderAlerts(data) {
  const alertsSection = document.getElementById('alertsSection');
  const alertsList = document.getElementById('alertsList');
  const alerts = [];
  const code = data.current.weather_code;

  if ([61, 63, 65, 80, 81, 82].includes(code)) {
    alerts.push({
      title: 'Rain Alert',
      description: 'Moderate to heavy rain expected in the next few hours',
      level: 'warning',
    });
  }

  if ([95, 96, 99].includes(code)) {
    alerts.push({
      title: 'Thunderstorm Alert',
      description: 'Severe thunderstorm warning in effect',
      level: 'danger',
    });
  }

  if (alerts.length > 0) {
    alertsSection.style.display = 'block';
    alertsList.innerHTML = alerts
      .map(
        (alert) => `
        <div class="alert-item ${alert.level}">
          <div class="alert-title">${alert.title}</div>
          <div class="alert-description">${alert.description}</div>
        </div>
      `
      )
      .join('');
  } else {
    alertsSection.style.display = 'none';
  }
}

async function fetchWeather(lat, lon, cityLabel) {
  try {
    const res = await fetch(`/api/weather?latitude=${lat}&longitude=${lon}`);
    const data = await res.json();

    if (!data.current) {
      throw new Error('Weather data unavailable');
    }

    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const icon = getWeatherIcon(current.weather_code);
    const desc = getWeatherLabel(current.weather_code);

    // Update DOM
    document.getElementById('cityName').textContent = cityLabel;
    document.getElementById('tempValue').textContent = Math.round(current.temperature_2m);
    document.getElementById('mainIcon').textContent = icon;
    document.getElementById('weatherDesc').textContent = desc;
    document.getElementById('feelsLike').textContent = `Feels like ${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('humidityValue').textContent = `${Math.round(current.relative_humidity_2m)}%`;
    document.getElementById('windValue').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('uvValue').textContent = `${Math.round(daily.uv_index_max[0] || 0)}`;
    document.getElementById('pressureValue').textContent = `${Math.round(current.pressure_msl || 1013)} mb`;
    document.getElementById('updateTime').textContent = `Updated ${formatTime(current.time)}`;
    document.getElementById('sunriseTime').textContent = formatTime(daily.sunrise[0]);
    document.getElementById('sunsetTime').textContent = formatTime(daily.sunset[0]);
    document.getElementById('rainValue').textContent = `${Math.round(daily.precipitation_sum[0] || 0)} mm`;

    renderForecast(daily);
    renderHourly(hourly);
    renderCharts(data);
    renderAlerts(data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    alert('Failed to load weather data. Please try again.');
  }
}

async function geocodeCity(name) {
  try {
    const response = await fetch(`/api/geocode?query=${encodeURIComponent(name)}`);
    const payload = await response.json();

    if (!payload.results || payload.results.length === 0) {
      alert(t('cityNotFound'));
      return null;
    }

    const location = payload.results[0];
    return {
      lat: location.latitude,
      lon: location.longitude,
      city: `${location.name}, ${location.country || ''}`,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Event Listeners
document.getElementById('searchBtn').addEventListener('click', async () => {
  const input = document.getElementById('citySearch');
  const query = input.value.trim();
  if (!query) return;

  const result = await geocodeCity(query);
  if (result) {
    state.lat = result.lat;
    state.lon = result.lon;
    state.city = result.city;
    fetchWeather(result.lat, result.lon, result.city);
    input.value = '';
  }
});

document.getElementById('citySearch').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('searchBtn').click();
  }
});

document.getElementById('locationBtn').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const reverse = await fetch(`/api/reverse-geocode?latitude=${lat}&longitude=${lon}`);
      const payload = await reverse.json();
      const place = payload.results?.[0];

      const cityLabel = place ? `${place.name}, ${place.country || ''}` : 'My Location';
      fetchWeather(lat, lon, cityLabel);
    },
    () => alert('Unable to get your location')
  );
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Initialize theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// Load default weather
window.addEventListener('DOMContentLoaded', async () => {
  const defaultCity = await geocodeCity('Jakarta');
  if (defaultCity) {
    state.lat = defaultCity.lat;
    state.lon = defaultCity.lon;
    state.city = defaultCity.city;
    fetchWeather(defaultCity.lat, defaultCity.lon, defaultCity.city);
  }
});