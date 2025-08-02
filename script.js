// Global variables
let currentWeather = null;
let currentLocation = null;
let spotifyAccessToken = null;

// Spotify API configuration (not used in this version)
const SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const SPOTIFY_CLIENT_SECRET = 'YOUR_SPOTIFY_CLIENT_SECRET';

// Verified Spotify Playlist IDs
const VERIFIED_PLAYLISTS = {
    '37i9dQZF1DX5Vy6DFOcx00': {
        id: '37i9dQZF1DX5Vy6DFOcx00',
        name: "Today's Top Hits",
        description: 'The hottest tracks right now.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX5Vy6DFOcx00' }
    },
    '37i9dQZF1DXcBWIGoYBM5M': {
        id: '37i9dQZF1DXcBWIGoYBM5M',
        name: 'All Out 2010s',
        description: 'The biggest songs of the 2010s.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a9' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' }
    },
    '37i9dQZF1DX3Ogo9pFvBkY': {
        id: '37i9dQZF1DX3Ogo9pFvBkY',
        name: 'Ambient Relaxation',
        description: 'Peaceful ambient music for relaxation.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a9' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY' }
    },
    '37i9dQZF1DX0XUsuxWHRQd': {
        id: '37i9dQZF1DX0XUsuxWHRQd',
        name: 'Acoustic Covers',
        description: 'Beautiful acoustic covers of popular songs.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a9' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd' }
    },
    '37i9dQZF1DX2sUQwD7tbmL': {
        id: '37i9dQZF1DX2sUQwD7tbmL',
        name: 'Indie Folk',
        description: 'Cozy indie folk music for comfortable days.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a9' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL' }
    },
    '37i9dQZF1DX1s9knjP51Oa': {
        id: '37i9dQZF1DX1s9knjP51Oa',
        name: 'calm vibes',
        description: 'Relaxing piano to help you find calm and stillness within.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002b1e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa' }
    }
};

// Define musicData: maps moods to playlist recommendations with verified, working Spotify playlists
const musicData = {
    happy: [
        { name: "Happy Hits!", description: "Feel-good pop anthems with the latest chart-toppers from global artists", genres: ['Pop', 'Chart-Toppers'], artists: ['Dua Lipa', 'Ed Sheeran', 'Taylor Swift'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC' },
        { name: "Bollywood Dance Music", description: "The biggest Bollywood dance tracks — perfect for mood lifting and fun energy", genres: ['Bollywood', 'Dance'], artists: ['Arijit Singh', 'Shreya Ghoshal', 'Badshah'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWTwbZHrJRIgD' },
        { name: "Tollywood Bangers", description: "High-energy Telugu hits from recent and blockbuster movies", genres: ['Tollywood', 'Telugu'], artists: ['Devi Sri Prasad', 'Thaman S', 'Anirudh Ravichander'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX2UT3NuRgcHd' }
    ],
    sad: [
        { name: "sad hour", description: "Deep, emotional, heartbreak pop and indie music", genres: ['Pop', 'Indie'], artists: ['Olivia Rodrigo', 'Billie Eilish', 'Lewis Capaldi', 'Tate McRae'], spotifyUrl: 'https://open.spotify.com/playlist/25ZzkJkOuYir9kHr2CqwPQ' },
        { name: "Hindi Sad Songs", description: "Bollywood heartbreak tracks, emotional ballads, breakup songs", genres: ['Bollywood', 'Hindi'], artists: ['Arijit Singh', 'Shreya Ghoshal', 'Jubin Nautiyal', 'B Praak'], spotifyUrl: 'https://open.spotify.com/playlist/2sOMIgioNPngXojcOuR4tn' },
        { name: "Telugu Heartbreak", description: "Deep emotional songs, breakup melodies, slow romantic pain", genres: ['Tollywood', 'Telugu'], artists: ['Sid Sriram', 'Anirudh', 'Armaan Malik', 'DSP'], spotifyUrl: 'https://open.spotify.com/playlist/4gyertnXGs2sSeUWOAKUP2' }
    ],
    energetic: [
        { name: "Power Workout", description: "High-energy tracks for maximum motivation", genres: ['Hip-Hop', 'Electronic'], artists: ['Eminem', 'The Prodigy', 'Skrillex'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP' },
        { name: "Bollywood Workout", description: "High-energy Bollywood tracks for pumping workouts", genres: ['Bollywood', 'Dance'], artists: ['Badshah', 'Yo Yo Honey Singh', 'Nucleya'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX3wwp27Epwn5' },
        { name: "Tollywood Energy", description: "Energetic Telugu hits for maximum motivation", genres: ['Tollywood', 'Telugu'], artists: ['Devi Sri Prasad', 'Thaman S', 'Anirudh'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4H5837Y8I1n' }
    ],
    calm: [
        { name: "Peaceful Piano", description: "Soothing piano melodies for relaxation", genres: ['Classical', 'Piano'], artists: ['Ludovico Einaudi', 'Max Richter', 'Ólafur Arnalds'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
        { name: "lofi songs", description: "Relaxing lo-fi beats for chill vibes", genres: ['Lo-fi', 'Chill'], artists: ['Nujabes', 'J Dilla', 'Emancipator'], spotifyUrl: 'https://open.spotify.com/playlist/5jYQ4O9Ii3tQcSbJMtVrk8' },
        { name: "Yoga and Meditation", description: "Peaceful music for yoga and meditation", genres: ['Meditation', 'Ambient'], artists: ['Various Artists', 'Meditation Music'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX9uKNf5jGX6m' }
    ],
    romantic: [
        { name: "Love Pop", description: "Romantic pop hits for special moments", genres: ['Pop', 'R&B'], artists: ['John Legend', 'Ed Sheeran', 'Alicia Keys'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXb1k22OmK8oq' },
        { name: "Hindi Love Songs", description: "Romantic Hindi melodies and ballads", genres: ['Bollywood', 'Romance'], artists: ['Arijit Singh', 'Shreya Ghoshal', 'Rahat Fateh Ali Khan'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX14CbVHtvHRB' },
        { name: "Telugu Love Songs", description: "Romantic Telugu film and classical songs", genres: ['Tollywood', 'Romance'], artists: ['Sid Sriram', 'Shreya Ghoshal', 'Karthik'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX44F1QWqYoaV' }
    ],
    focus: [
        { name: "Deep Focus Music", description: "Binaural beats tuned to 40 Hz for deep focus to help you improve focus, concentration, productivity, creativity and alertness", genres: ['Binaural Beats', 'Focus'], artists: ['Brainy'], spotifyUrl: 'https://open.spotify.com/playlist/14KtkIpsvzDSCXR24EqHCL' },
        { name: "Focus Instrumental Mix", description: "Focus Instrumental music picked just for you", genres: ['Instrumental', 'Classical'], artists: ['Ludovico Einaudi', 'Hans Zimmer', 'Max Richter'], spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1EIdxBDb6LQWyy' },
        { name: "40 Hz Focus Music (Binaural Beats)", description: "Binaural beats album for focus, memory, and concentration", genres: ['Binaural Beats', 'Focus'], artists: ['Miracle Tones'], spotifyUrl: 'https://open.spotify.com/album/5baRf4F8dxdSlvodD3QdEA' }
    ]
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    document.getElementById('startMagic').addEventListener('click', startMagic);
    document.getElementById('manualLocation').addEventListener('click', toggleManualLocation);
    document.getElementById('searchLocation').addEventListener('click', searchManualLocation);
    document.getElementById('cityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchManualLocation();
    });
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            showMusicForMood(mood);
        });
    });
});

function updateDateTime() {
    const now = new Date();
    const formattedTime = now.toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    });
    document.getElementById('dateTime').textContent = formattedTime;
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    hideError();
    const funMessages = [
        "🎵 Tuning into the cosmic music vibes...",
        "🌟 Summoning the music spirits...",
        "🎶 Reading the weather's musical mind...",
        "✨ Channeling your perfect playlist...",
        "🎼 Decoding the universe's rhythm...",
        "🎤 Asking the clouds what they're listening to...",
        "🎧 Translating weather into beats...",
        "🎹 Finding the harmony in your atmosphere...",
        "🎸 Consulting the musical weather gods...",
        "🎺 Orchestrating your perfect soundscape..."
    ];
    const loadingMessage = document.getElementById('loadingMessage');
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        loadingMessage.textContent = funMessages[messageIndex];
        messageIndex = (messageIndex + 1) % funMessages.length;
    }, 2000);
    window.loadingMessageInterval = messageInterval;
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    if (window.loadingMessageInterval) {
        clearInterval(window.loadingMessageInterval);
        window.loadingMessageInterval = null;
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    hideLoading();
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

/**
 * Gets the user's current location with high accuracy and converts coordinates to city name
 * @returns {Promise<Object>} Object containing latitude, longitude, and city name
 */
async function getAccurateLocation() {
    return new Promise((resolve, reject) => {
        // Check if geolocation is supported by the browser
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by this browser');
            reject(new Error('Geolocation not supported'));
            return;
        }

        // Configure geolocation options for maximum precision
        const options = {
            enableHighAccuracy: true,  // Use GPS if available for better accuracy
            timeout: 15000,           // Wait up to 15 seconds for high accuracy
            maximumAge: 0             // Don't use cached location data - always get fresh location
        };

        // Get current position using HTML5 Geolocation API
        navigator.geolocation.getCurrentPosition(
            // Success callback - called when location is successfully obtained
            async (position) => {
                try {
                    // Extract latitude and longitude from position object
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    console.log(`Location obtained: ${latitude}, ${longitude}`);
                    console.log(`Accuracy: ${position.coords.accuracy} meters`);

                    // Call reverse geocoding to get human-readable city name
                    const cityName = await getLocationName(latitude, longitude);

                    // Return the complete location data
                    resolve({
                        latitude: latitude,
                        longitude: longitude,
                        cityName: cityName,
                        accuracy: position.coords.accuracy
                    });

                } catch (geocodingError) {
                    console.error('Error during reverse geocoding:', geocodingError);
                    // Still resolve with coordinates even if city name lookup fails
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        cityName: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
                        accuracy: position.coords.accuracy
                    });
                }
            },

            // Error callback - called when location cannot be obtained
            (error) => {
                // Handle different types of geolocation errors
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.error('Location access denied by user');
                        reject(new Error('Permission denied: User denied location access'));
                        break;

                    case error.POSITION_UNAVAILABLE:
                        console.error('Location information is unavailable');
                        reject(new Error('Position unavailable: Location information not available'));
                        break;

                    case error.TIMEOUT:
                        console.error('Location request timed out after 10 seconds');
                        reject(new Error('Timeout: Location request took too long'));
                        break;

                    default:
                        console.error('An unknown error occurred while retrieving location');
                        reject(new Error('Unknown error occurred during location retrieval'));
                        break;
                }
            },

            // Pass the options object to getCurrentPosition
            options
        );
    });
}

async function startMagic() {
    try {
        showLoading();

        // Use the new high-accuracy location function
        const location = await getAccurateLocation();

        // Call weather and music function with the obtained location
        await getWeatherAndMusic(location.latitude, location.longitude, location.cityName);

    } catch (error) {
        console.error('Error in startMagic:', error);

        // Provide user-friendly error messages
        let errorMessage = 'Unable to get your location. ';
        if (error.message.includes('Permission denied')) {
            errorMessage += 'Location access denied. Please enable location services or try manual location.';
        } else if (error.message.includes('Position unavailable')) {
            errorMessage += 'Location information unavailable. Please try manual location.';
        } else if (error.message.includes('Timeout')) {
            errorMessage += 'Location request timed out. Please try manual location.';
        } else if (error.message.includes('not supported')) {
            errorMessage += 'Geolocation is not supported by this browser. Please use manual location.';
        } else {
            errorMessage += 'An unknown error occurred. Please try manual location.';
        }

        showError(errorMessage);
    }
}

function toggleManualLocation() {
    const locationInput = document.getElementById('locationInput');
    const isVisible = locationInput.style.display === 'block';
    locationInput.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        document.getElementById('cityInput').focus();
    }
}

async function searchManualLocation() {
    const cityName = document.getElementById('cityInput').value.trim();
    if (!cityName) {
        showError('Please enter a city name.');
        return;
    }
    showLoading();
    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`);
        if (!geoResponse.ok) throw new Error('City not found');
        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) {
            showError('City not found. Please try again.');
            hideLoading();
            return;
        }
        const loc = geoData.results[0];
        getWeatherAndMusic(loc.latitude, loc.longitude, `${loc.name}, ${loc.country}`);
    } catch (err) {
        showError('Failed to find city. Check your connection.');
    } finally {
        hideLoading();
    }
}

async function getOpenMeteoWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,cloud_cover,pressure_msl&hourly=temperature_2m,precipitation,weather_code&timezone=auto&forecast_days=1`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.current ? {
        temperature_2m: data.current.temperature_2m,
        relative_humidity_2m: data.current.relative_humidity_2m,
        weather_code: data.current.weather_code,
        wind_speed_10m: data.current.wind_speed_10m,
        precipitation: data.current.precipitation,
        cloud_cover: data.current.cloud_cover,
        pressure_msl: data.current.pressure_msl,
        source: 'open-meteo'
    } : null;
}

function displayWeather(weatherData, cityName) {
    const weatherInfo = getAccurateWeatherInfo(weatherData);
    document.getElementById('weatherIcon').textContent = weatherInfo.emoji;
    document.getElementById('cityName').textContent = cityName;
    document.getElementById('weatherDescription').textContent = weatherInfo.description;

    const detailsHTML = `
        <div class="weather-detail"><div>🌡️ Temperature</div><div>${Math.round(weatherData.temperature_2m)}°C</div></div>
        <div class="weather-detail"><div>💧 Humidity</div><div>${weatherData.relative_humidity_2m}%</div></div>
        <div class="weather-detail"><div>💨 Wind Speed</div><div>${Math.round(weatherData.wind_speed_10m)} km/h</div></div>
        <div class="weather-detail"><div>🌧️ Precipitation</div><div>${weatherData.precipitation > 0 ? weatherData.precipitation.toFixed(1) + ' mm' : 'None'}</div></div>
        <div class="weather-detail"><div>☁️ Cloud Cover</div><div>${weatherData.cloud_cover}%</div></div>
        <div class="weather-detail"><div>🌤️ Condition</div><div>${weatherInfo.description}</div></div>
    `;
    document.getElementById('weatherDetails').innerHTML = detailsHTML;
    const weatherContainer = document.getElementById('weatherContainer');
    weatherContainer.style.display = 'block';
    setTimeout(() => weatherContainer.classList.add('show'), 50);
}

function getAccurateWeatherInfo(current) {
    const weatherCode = current.weather_code;
    const precipitation = current.precipitation || 0;
    const cloudCover = current.cloud_cover || 0;
    const temperature = current.temperature_2m;

    const weatherMap = {
        0: { emoji: '☀️', description: 'Clear Sky', mood: 'happy' },
        1: { emoji: '🌤️', description: 'Mainly Clear', mood: 'happy' },
        2: { emoji: '⛅', description: 'Partly Cloudy', mood: 'calm' },
        3: { emoji: '☁️', description: 'Overcast', mood: 'calm' },
        45: { emoji: '🌫️', description: 'Foggy', mood: 'calm' },
        51: { emoji: '🌦️', description: 'Light Drizzle', mood: 'sad' },
        61: { emoji: '🌧️', description: 'Slight Rain', mood: 'sad' },
        71: { emoji: '🌨️', description: 'Slight Snow', mood: 'calm' },
        95: { emoji: '⛈️', description: 'Thunderstorm', mood: 'energetic' }
    };

    let base = weatherMap[weatherCode] || { emoji: '🌈', description: 'Unknown', mood: 'happy' };
    let desc = base.description;

    if (precipitation > 0) desc = precipitation < 2.5 ? 'Light Rain' : 'Heavy Rain';
    if (cloudCover > 80) desc = 'Very Cloudy';

    return { emoji: base.emoji, description: desc, mood: base.mood };
}

function showMoodSelector() {
    const moodSelector = document.getElementById('moodSelector');
    moodSelector.style.display = 'block';
    setTimeout(() => moodSelector.classList.add('show'), 50);
}

// Helper function to convert text to proper title case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Helper function to format playlist description with proper casing
function formatDescription(description) {
    // Handle common description patterns and improve casing
    if (!description) return 'Curated playlist for your mood';

    // Convert to proper sentence case
    let formatted = description.charAt(0).toUpperCase() + description.slice(1).toLowerCase();

    // Fix common words that should be capitalized
    formatted = formatted.replace(/\b(spotify|apple|music|playlist|hits|top|all|out)\b/gi, (match) => {
        return match.toLowerCase() === 'spotify' ? 'Spotify' : toTitleCase(match);
    });

    return formatted;
}

async function showMusicForMood(mood) {
    const recommendations = musicData[mood] || musicData.happy;

    // Create music cards from recommendations without album art
    const musicHTML = recommendations.map((music) => {
        // Format the playlist name and description with proper casing
        const formattedName = toTitleCase(music.name);
        const formattedDescription = formatDescription(music.description);

        return `
            <div class="music-card" onclick="openSpotify('${music.spotifyUrl}')">
                <div class="music-card-info">
                    <h4>${formattedName}</h4>
                    <p>${formattedDescription}</p>
                    <div class="weather-match"><span class="weather-match-tag">� Perfect For ${toTitleCase(mood)} Mood</span></div>
                </div>
                <div class="music-card-details">
                    <div class="music-genres">${music.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}</div>
                    <div class="music-artists">🎤 ${music.artists.join(', ')}</div>
                </div>
            </div>
        `;
    });

    document.getElementById('musicRecommendations').innerHTML = musicHTML.join('');
    const musicContainer = document.getElementById('musicContainer');
    musicContainer.style.display = 'block';
    setTimeout(() => musicContainer.classList.add('show'), 50);
}

async function fetchSpotifyPlaylistData(playlistId) {
    return VERIFIED_PLAYLISTS[playlistId] || {
        name: 'Spotify Playlist',
        description: 'A curated playlist for your mood.',
        images: [{ url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' }],
        external_urls: { spotify: `https://open.spotify.com/playlist/${playlistId}` }
    };
}

// Get precise location name from coordinates with multiple fallback strategies
async function getLocationName(lat, lon) {
    try {
        // First attempt: Maximum precision (zoom=18)
        let response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&extratags=1`,
            {
                headers: {
                    'User-Agent': 'MoodMusic-App/1.0'
                }
            }
        );

        let data = await response.json();

        // If no detailed data at zoom 18, try zoom 16 (still precise but broader)
        if (!data || !data.address || Object.keys(data.address).length < 3) {
            console.log('Trying broader zoom level for better results...');
            response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'MoodMusic-App/1.0'
                    }
                }
            );
            data = await response.json();
        }

        if (data && data.address) {
            const address = data.address;

            // Enhanced priority order for precise location (most specific first)
            const preciseLocation =
                address.neighbourhood ||           // Neighborhood/area name (like "Rassolpura")
                address.suburb ||                  // Suburb name
                address.village ||                 // Village name
                address.hamlet ||                  // Small village/hamlet
                address.residential ||             // Residential area
                address.quarter ||                 // City quarter
                address.city_district ||           // City district
                address.sublocality ||             // Sublocality (common in India)
                address.locality ||                // Locality
                address.town ||                    // Town name
                address.city ||                    // City name
                address.municipality ||            // Municipality
                address.county ||                  // County/Mandal (fallback)
                address.state_district ||          // State district
                'Unknown Location';

            // Get broader context for complete address
            const city = address.city || address.town || address.municipality;
            const state = address.state;

            // Format the location string with precise location first
            let locationString = preciseLocation;

            // Add city if it's different from precise location and exists
            if (city && city !== preciseLocation && !locationString.toLowerCase().includes(city.toLowerCase())) {
                locationString += `, ${city}`;
            }

            // Add state if available and not already included
            if (state && !locationString.toLowerCase().includes(state.toLowerCase())) {
                locationString += `, ${state}`;
            }

            // Log detailed information for debugging
            console.log('🎯 Precise location found:', locationString);
            console.log('📍 Coordinates:', `${lat.toFixed(6)}, ${lon.toFixed(6)}`);
            console.log('🏠 Address components:', {
                neighbourhood: address.neighbourhood,
                suburb: address.suburb,
                village: address.village,
                city: address.city,
                state: address.state
            });

            return locationString;
        }

        // Fallback to coordinates if no address data
        console.warn('No address data available, using coordinates');
        return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

    } catch (error) {
        console.error('Error getting location name:', error);
        return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
}

// Main function to get weather and display music recommendations
async function getWeatherAndMusic(lat, lon, locationName = null) {
    try {
        // Get weather data
        const weatherData = await getOpenMeteoWeather(lat, lon);
        if (!weatherData) {
            showError('Unable to fetch weather data. Please try again.');
            return;
        }

        // Get location name if not provided
        if (!locationName) {
            locationName = await getLocationName(lat, lon);
        }

        // Store current data
        currentWeather = weatherData;
        currentLocation = { lat, lon, name: locationName };

        // Display weather information
        displayWeather(weatherData, locationName);

        // Show mood selector
        showMoodSelector();

        // Get weather-based mood and show initial recommendations
        const weatherInfo = getAccurateWeatherInfo(weatherData);
        const suggestedMood = weatherInfo.mood || 'happy';

        // Show music recommendations based on weather
        await showMusicForMood(suggestedMood);

        hideLoading();

    } catch (error) {
        console.error('Error in getWeatherAndMusic:', error);
        showError('Something went wrong. Please try again.');
        hideLoading();
    }
}

function openSpotify(url) {
    window.open(url, '_blank');
}

// Add error handling for network issues
window.addEventListener('online', function() {
    if (document.getElementById('error').style.display === 'block') {
        hideError();
    }
});

window.addEventListener('offline', function() {
    showError('You are offline. Please check your internet connection.');
});

// Add event listeners for mood buttons
document.addEventListener('DOMContentLoaded', function() {
    // Mood button event listeners
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            showMusicForMood(mood);

            // Update active mood button
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Hide location input if visible
        const locationInput = document.getElementById('locationInput');
        if (locationInput.style.display === 'block') {
            locationInput.style.display = 'none';
        }
    }
});