#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Open-Meteo API endpoints
const WEATHER_API = 'https://api.open-meteo.com/v1';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1';
const ELEVATION_API = 'https://api.open-elevation.com/api/v1';

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Weather API server running' });
});

// Get weather for coordinates
app.post('/api/weather', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const response = await axios.get(
      `${WEATHER_API}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature,precipitation,weather_code,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset&hourly=temperature_2m,weather_code,precipitation,wind_speed_10m,relative_humidity_2m,apparent_temperature,uv_index,is_day&timezone=auto`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Geocode city name to coordinates
app.get('/api/geocode', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query required' });
    }

    const response = await axios.get(
      `${GEOCODING_API}/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Geocoding API error:', error.message);
    res.status(500).json({ error: 'Failed to geocode location' });
  }
});

// Reverse geocode coordinates to city name
app.get('/api/reverse-geocode', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const response = await axios.get(
      `${GEOCODING_API}/reverse?latitude=${latitude}&longitude=${longitude}&language=en`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    res.status(500).json({ error: 'Failed to reverse geocode' });
  }
});

// Get elevation
app.get('/api/elevation', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const response = await axios.get(
      `${ELEVATION_API}/lookup?locations=${latitude},${longitude}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Elevation API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch elevation' });
  }
});

// Get weather alerts simulation (based on weather conditions)
app.post('/api/alerts', async (req, res) => {
  try {
    const { latitude, longitude, weather_code } = req.body;

    const alerts = [];

    // Simulate alerts based on weather conditions
    if ([95, 96, 99].includes(weather_code)) {
      alerts.push({
        severity: 'high',
        type: 'THUNDERSTORM',
        message: '⚡ Thunderstorm warning in effect',
        description: 'Severe thunderstorms expected. Stay indoors and avoid outdoor activities.'
      });
    }

    if ([71, 73, 75, 77, 85, 86].includes(weather_code)) {
      alerts.push({
        severity: 'medium',
        type: 'WINTER_WEATHER',
        message: '❄️ Winter weather advisory',
        description: 'Heavy snow expected. Exercise caution while traveling.'
      });
    }

    if ([65].includes(weather_code)) {
      alerts.push({
        severity: 'low',
        type: 'HEAVY_RAIN',
        message: '💧 Heavy rain expected',
        description: 'Rainfall may cause localized flooding in low-lying areas.'
      });
    }

    res.json({ alerts, count: alerts.length });
  } catch (error) {
    console.error('Alerts generation error:', error.message);
    res.status(500).json({ error: 'Failed to generate alerts' });
  }
});

// Catch-all for SPA
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`🌤️  Weather Dashboard API running at http://localhost:${port}`);
  console.log(`📍 API endpoints:`);
  console.log(`   POST /api/weather - Get weather data`);
  console.log(`   GET /api/geocode - Search locations`);
  console.log(`   GET /api/reverse-geocode - Get location name from coordinates`);
  console.log(`   GET /api/elevation - Get elevation data`);
  console.log(`   POST /api/alerts - Get weather alerts`);
});
