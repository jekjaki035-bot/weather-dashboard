# WeatherFlow - Minimalist Modern Weather Dashboard

🌤️ A beautiful, responsive weather dashboard with multilingual support.

## Features

✅ **Minimalist Modern Design** - Clean, simple, and beautiful UI
✅ **Multilingual Support** - English, Indonesian, Japanese, Korean, Chinese, Spanish
✅ **Mobile-First** - Fully responsive for smartphones, tablets, and desktops
✅ **Dark Mode** - Toggle between light and dark themes
✅ **Real-Time Weather** - Powered by Open-Meteo (free, no API key)
✅ **Live Charts** - Temperature, humidity, and wind speed trends
✅ **7-Day Forecast** - See weather predictions for the week
✅ **Hourly Forecast** - 12-hour detailed forecast
✅ **Weather Alerts** - Automatic alerts for severe weather

## Quick Start (Local)

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/jekjaki035-bot/weather-dashboard.git
cd weather-dashboard
npm install
```

### Run

```bash
npm start
```

Open http://localhost:3000 in your browser.

## Deploy to Vercel (Recommended)

### 1. Push to GitHub

```bash
git add .
git commit -m "Add weather dashboard"
git push origin main
```

### 2. Deploy to Vercel

- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Click "Deploy"
- Wait ~1-2 minutes
- Share the live URL with anyone!

## Mobile Access

After deploying to Vercel:
1. Copy the live URL from Vercel dashboard
2. Open it on your phone's browser
3. Bookmark it for quick access

## Usage

### Search for a City
1. Enter city name in search box
2. Click "Search" or press Enter
3. Weather updates automatically

### Use Your Location
1. Click the 📍 button
2. Allow location access
3. Weather loads for your current location

### Change Language
1. Click desired language button (top-right)
2. UI updates instantly

### Toggle Dark Mode
1. Click the 🌙 button
2. Theme switches between light and dark

## API

- **Weather Data**: Open-Meteo (https://open-meteo.com)
- **Geocoding**: Open-Meteo Geocoding API
- **No authentication required** - Completely free

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Charts**: Chart.js
- **Hosting**: Vercel (recommended)
- **API**: Open-Meteo (free weather data)

## Project Structure

```
weather-dashboard/
├── public/
│   ├── minimal.html
│   ├── style-minimal.css
│   ├── app-minimal.js
│   └── i18n.js
├── server.js
├── package.json
└── vercel.json
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Load Time**: < 2 seconds
- **Bundle Size**: ~50KB (uncompressed)
- **API Response**: < 500ms
- **Mobile Optimized**: Touch-friendly interface

## License

MIT License - Feel free to use for personal or commercial projects

## Support

For issues or suggestions:
- GitHub Issues: [weather-dashboard/issues](https://github.com/jekjaki035-bot/weather-dashboard/issues)
- Email: jekjaki035@gmail.com

## Changelog

### v2.0.0 (2026-10-08)
- Complete redesign with minimalist modern theme
- Added multilingual support (6 languages)
- Full mobile optimization
- Dark mode support
- Chart.js integration
- Vercel deployment ready

---

**Made with ❤️ by WeatherFlow Team**
