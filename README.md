# 🎵 MoodMusic Magic Box - Weather-Based Music Recommendations

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://your-username.github.io/moodmusic-magic-box/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success)](https://github.com/your-username/moodmusic-magic-box)

A beautiful, responsive web application that intelligently recommends Spotify playlists based on your current weather conditions and mood preferences. Experience the perfect harmony between nature's atmosphere and your musical taste!

## ✨ Features

- **🌤️ Real-time Weather Detection**: Uses Open-Meteo API with optional Visual Crossing integration
- **📍 Precise Location Services**: Reverse geocoding with OpenStreetMap for exact location display
- **🎶 Smart Music Recommendations**: Curated Spotify playlists perfectly matched to weather conditions
- **🎭 6 Mood Options**: Happy 😊, Sad 😢, Energetic ⚡, Calm 🧘, Romantic 💕, Focus 🎯
- **🎨 Beautiful UI**: Animated gradients, glassmorphism effects, and smooth transitions
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **🔄 Offline Detection**: Smart handling of network connectivity issues
- **⌨️ Keyboard Shortcuts**: Enhanced accessibility with ESC key support

## Spotify API Integration

The app now includes Spotify Web API integration to fetch real playlists based on weather conditions. The displayed playlist titles now match the actual Spotify playlists!

### Current Implementation

The app uses carefully curated Spotify playlist IDs with real playlist data:

- **Happy Mood**: "Today's Top Hits" for sunny, clear weather
- **Sad Mood**: "Rainy Day" playlist for rain, drizzle, overcast conditions  
- **Energetic Mood**: "All Out 2010s" for thunderstorm, stormy, intense weather
- **Calm Mood**: "Ambient Relaxation" for calm, peaceful, gentle weather
- **Romantic Mood**: "Today's Top Hits" for sunset, romantic, intimate weather
- **Focus Mood**: "Ambient Relaxation" for focus, concentration, work-friendly weather

### Full Spotify API Integration (Future Enhancement)

To implement real-time Spotify API search:

1. **Create a Spotify Developer Account**:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Log in with your Spotify account
   - Create a new app

2. **Get Your Credentials**:
   - Copy your `Client ID` and `Client Secret`
   - Add your redirect URI (e.g., `http://localhost:3000/callback`)

3. **Set Up Backend Service** (Required for OAuth):
   - Due to CORS restrictions, you'll need a backend service to handle Spotify OAuth
   - You can use Node.js, Python, or any backend framework
   - The backend should handle the OAuth flow and provide access tokens

4. **Update the Code**:
   - Replace `YOUR_SPOTIFY_CLIENT_ID` and `YOUR_SPOTIFY_CLIENT_SECRET` in `script.js`
   - Implement the `getSpotifyAccessToken()` function to get tokens from your backend
   - Update the `fetchSpotifyPlaylistData()` function to make actual API calls

## Weather API Setup

### Visual Crossing API (Optional but Recommended)

For more accurate weather data, you can set up Visual Crossing API:

1. Sign up at [Visual Crossing Weather](https://www.visualcrossing.com/)
2. Get your API key
3. Replace `YOUR_API_KEY` in the `getVisualCrossingWeather()` function

If you don't have a Visual Crossing API key, the app will fall back to Open-Meteo API (free, no key required).

## How It Works

1. **Location Detection**: Uses browser geolocation or manual city search
2. **Weather Fetching**: Combines data from multiple weather APIs for accuracy
3. **Playlist Matching**: Searches for Spotify playlists based on weather keywords and mood
4. **Display**: Shows weather info and music recommendations with clickable playlist links

## File Structure

```
MOODMUSIC/
├── index.html          # Main HTML file
├── style.css           # Styling and animations
├── script.js           # Main JavaScript logic
└── README.md           # This file
```

## 🚀 Quick Start

### Option 1: Try the Live Demo
Visit the [live demo](https://your-username.github.io/moodmusic-magic-box/) to experience the app immediately!

### Option 2: Run Locally
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/moodmusic-magic-box.git
   cd moodmusic-magic-box
   ```

2. **Start a local server:**
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. **Open your browser:**
   Navigate to `http://localhost:8000`

## 📖 How to Use

1. **🌟 Click "Start Magic"** - Allow location access for automatic weather detection
2. **📍 Or use "Manual Location"** - Search for any city worldwide
3. **🌤️ View Weather Info** - See current conditions with beautiful weather icons
4. **🎭 Choose Your Mood** - Select from 6 different mood options
5. **🎵 Discover Music** - Click any playlist card to open in Spotify
6. **🔄 Explore More** - Try different moods to discover new music!

## Technical Details

- **Weather APIs**: Open-Meteo (free) + Visual Crossing (optional)
- **Location**: Nominatim reverse geocoding for precise location
- **Music**: Spotify Web API integration with curated playlists
- **UI**: Pure CSS with animated gradients and smooth transitions
- **Responsive**: Works on desktop and mobile devices

## Future Enhancements

- Real-time Spotify API integration with OAuth
- More sophisticated playlist matching algorithms
- User preference learning
- Social sharing features
- Offline playlist caching

## 🛠️ Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **"Start Magic" doesn't work** | Allow location access in browser settings |
| **No weather data** | Check internet connection; try manual location |
| **Spotify links don't open** | Ensure Spotify is installed or use web player |
| **Location not found** | Try different city name format (e.g., "New York, NY") |
| **App looks broken** | Clear browser cache and refresh |

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### API Status
- 🟢 Open-Meteo: No limits, always free
- 🟡 Visual Crossing: 1000 calls/day (optional)
- 🟢 OpenStreetMap: Rate limited but generous

## License

This project is open source and available under the MIT License. 