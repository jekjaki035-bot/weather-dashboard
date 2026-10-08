// Multilingual i18n system
const translations = {
  en: {
    appName: 'WeatherFlow',
    searchPlaceholder: 'Search city...',
    search: 'Search',
    location: 'Location',
    humidity: 'Humidity',
    wind: 'Wind',
    uv: 'UV Index',
    pressure: 'Pressure',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    rain: 'Rain',
    forecast7days: '7-Day Forecast',
    hourlyForecast: 'Hourly Forecast',
    temperatureTrend: 'Temperature Trend',
    alerts: 'Weather Alerts',
    footerText: 'Data powered by Open-Meteo • Updated automatically every 10 minutes',
    noAlerts: 'No weather alerts at this time',
    searching: 'Searching...',
    error: 'Error',
    cityNotFound: 'City not found. Try another search.',
    loadingWeather: 'Loading weather data...',
  },
  id: {
    appName: 'WeatherFlow',
    searchPlaceholder: 'Cari kota...',
    search: 'Cari',
    location: 'Lokasi',
    humidity: 'Kelembaban',
    wind: 'Angin',
    uv: 'Indeks UV',
    pressure: 'Tekanan',
    sunrise: 'Matahari Terbit',
    sunset: 'Matahari Terbenam',
    rain: 'Hujan',
    forecast7days: 'Prakiraan 7 Hari',
    hourlyForecast: 'Prakiraan Per Jam',
    temperatureTrend: 'Tren Suhu',
    alerts: 'Peringatan Cuaca',
    footerText: 'Data dari Open-Meteo • Diperbarui otomatis setiap 10 menit',
    noAlerts: 'Tidak ada peringatan cuaca saat ini',
    searching: 'Mencari...',
    error: 'Kesalahan',
    cityNotFound: 'Kota tidak ditemukan. Coba pencarian lain.',
    loadingWeather: 'Memuat data cuaca...',
  },
  ja: {
    appName: 'WeatherFlow',
    searchPlaceholder: '都市を検索...',
    search: '検索',
    location: '場所',
    humidity: '湿度',
    wind: '風',
    uv: 'UV指数',
    pressure: '気圧',
    sunrise: '日の出',
    sunset: '日の入り',
    rain: '雨',
    forecast7days: '7日間の予報',
    hourlyForecast: '時間予報',
    temperatureTrend: '気温トレンド',
    alerts: '天気警報',
    footerText: 'Open-Meteoのデータ • 10分ごとに自動更新',
    noAlerts: '現在、天気警報はありません',
    searching: '検索中...',
    error: 'エラー',
    cityNotFound: '都市が見つかりません。別の検索を試してください。',
    loadingWeather: '天気データを読み込み中...',
  },
  ko: {
    appName: 'WeatherFlow',
    searchPlaceholder: '도시 검색...',
    search: '검색',
    location: '위치',
    humidity: '습도',
    wind: '바람',
    uv: 'UV 지수',
    pressure: '기압',
    sunrise: '일출',
    sunset: '일몰',
    rain: '비',
    forecast7days: '7일 예보',
    hourlyForecast: '시간별 예보',
    temperatureTrend: '기온 추세',
    alerts: '날씨 경보',
    footerText: 'Open-Meteo의 데이터 • 10분마다 자동 업데이트',
    noAlerts: '현재 날씨 경보가 없습니다',
    searching: '검색 중...',
    error: '오류',
    cityNotFound: '도시를 찾을 수 없습니다. 다른 검색을 시도하세요.',
    loadingWeather: '날씨 데이터 로드 중...',
  },
  zh: {
    appName: 'WeatherFlow',
    searchPlaceholder: '搜索城市...',
    search: '搜索',
    location: '位置',
    humidity: '湿度',
    wind: '风速',
    uv: '紫外线指数',
    pressure: '气压',
    sunrise: '日出',
    sunset: '日落',
    rain: '降雨',
    forecast7days: '7天预报',
    hourlyForecast: '每小时预报',
    temperatureTrend: '温度趋势',
    alerts: '天气警告',
    footerText: 'Open-Meteo数据 • 每10分钟自动更新',
    noAlerts: '目前没有天气警告',
    searching: '搜索中...',
    error: '错误',
    cityNotFound: '未找到城市。请尝试其他搜索。',
    loadingWeather: '加载天气数据中...',
  },
  es: {
    appName: 'WeatherFlow',
    searchPlaceholder: 'Buscar ciudad...',
    search: 'Buscar',
    location: 'Ubicación',
    humidity: 'Humedad',
    wind: 'Viento',
    uv: 'Índice UV',
    pressure: 'Presión',
    sunrise: 'Salida del sol',
    sunset: 'Puesta del sol',
    rain: 'Lluvia',
    forecast7days: 'Pronóstico de 7 días',
    hourlyForecast: 'Pronóstico por hora',
    temperatureTrend: 'Tendencia de temperatura',
    alerts: 'Alertas meteorológicas',
    footerText: 'Datos de Open-Meteo • Se actualiza automáticamente cada 10 minutos',
    noAlerts: 'No hay alertas meteorológicas en este momento',
    searching: 'Buscando...',
    error: 'Error',
    cityNotFound: 'Ciudad no encontrada. Intenta otra búsqueda.',
    loadingWeather: 'Cargando datos meteorológicos...',
  },
};

let currentLang = localStorage.getItem('lang') || 'en';

function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updatePageLanguage();
  }
}

function t(key) {
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

function updatePageLanguage() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Update HTML lang attribute
  document.documentElement.lang = currentLang;
}

// Initialize language
window.addEventListener('DOMContentLoaded', () => {
  updatePageLanguage();
  
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
      document.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});