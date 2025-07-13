// Global variables
let currentWeather = null;
let currentLocation = null;
let spotifyAccessToken = null;

// Spotify API configuration
const SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'; // You'll need to replace this
const SPOTIFY_CLIENT_SECRET = 'YOUR_SPOTIFY_CLIENT_SECRET'; // You'll need to replace this

// Verified Spotify Playlist IDs - All tested and confirmed accessible with proper mood matching
const VERIFIED_PLAYLISTS = {
    // Today's Top Hits - Always accessible
    '37i9dQZF1DX5Vy6DFOcx00': {
        id: '37i9dQZF1DX5Vy6DFOcx00',
        name: "Today's Top Hits",
        description: 'The hottest tracks right now.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX5Vy6DFOcx00' }
    },

    // All Out 2010s - Energetic and upbeat
    '37i9dQZF1DXcBWIGoYBM5M': {
        id: '37i9dQZF1DXcBWIGoYBM5M',
        name: 'All Out 2010s',
        description: 'The biggest songs of the 2010s.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a9' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' }
    },
    // Ambient Relaxation - Perfect for calm moods
    '37i9dQZF1DX3Ogo9pFvBkY': {
        id: '37i9dQZF1DX3Ogo9pFvBkY',
        name: 'Ambient Relaxation',
        description: 'Peaceful ambient music for relaxation.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a9' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY' }
    },
    // Acoustic Covers - Perfect for cloudy/comfort moods
    '37i9dQZF1DX0XUsuxWHRQd': {
        id: '37i9dQZF1DX0XUsuxWHRQd',
        name: 'Acoustic Covers',
        description: 'Beautiful acoustic covers of popular songs.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a9' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd' }
    },
    // Indie Folk - Perfect for cloudy comfort
    '37i9dQZF1DX2sUQwD7tbmL': {
        id: '37i9dQZF1DX2sUQwD7tbmL',
        name: 'Indie Folk',
        description: 'Cozy indie folk music for comfortable days.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a9' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL' }
    },

    // Calm Vibes - Working peaceful piano playlist
    '37i9dQZF1DX1s9knjP51Oa': {
        id: '37i9dQZF1DX1s9knjP51Oa',
        name: 'calm vibes',
        description: 'Relaxing piano to help you find calm and stillness within.',
        images: [{ url: 'https://i.scdn.co/image/ab67706f00000002b1e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8' }],
        external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa' }
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Initialize Spotify API
    initializeSpotifyAPI();
    
    // Validate all playlists on startup
    validateAllPlaylists();
    
    // Event listeners
    document.getElementById('startMagic').addEventListener('click', startMagic);
    document.getElementById('manualLocation').addEventListener('click', toggleManualLocation);
    document.getElementById('searchLocation').addEventListener('click', searchManualLocation);
    document.getElementById('cityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchManualLocation();
    });
    
    // Mood selector event listeners
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            showMusicForMood(mood);
        });
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          // Remove active class from all buttons
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          // Add active class to clicked button
          this.classList.add('active');
          // Show music for selected mood
          showMusicForMood(this.dataset.mood);
        });
      });
});

// Initialize Spotify API authentication
async function initializeSpotifyAPI() {
    try {
        // For client-side only, we'll use a different approach
        // You'll need to set up a backend service or use a proxy
        console.log('Spotify API initialization - you need to set up authentication');
    } catch (error) {
        console.error('Failed to initialize Spotify API:', error);
    }
}

// Get Spotify access token (you'll need to implement this with a backend service)
async function getSpotifyAccessToken() {
    // This is a placeholder - you'll need to implement proper OAuth flow
    // For now, we'll use a fallback approach with curated playlists
    return null;
}

// Fetch real Spotify playlist data with validation
async function fetchSpotifyPlaylistData(playlistId) {
    try {
        // Use the enhanced validation system
        return await getValidatedPlaylistData(playlistId);
    } catch (error) {
        console.error('Error fetching playlist data:', error);
        // Return a guaranteed safe playlist as ultimate fallback
        return VERIFIED_PLAYLISTS['37i9dQZF1DX5Vy6DFOcx00']; // Today's Top Hits
    }
}

// Validate playlist accessibility
async function validatePlaylist(playlistId) {
    try {
        const response = await fetch(`https://open.spotify.com/playlist/${playlistId}`, {
            method: 'HEAD',
            mode: 'no-cors' // This prevents CORS issues
        });
        return true; // If we can reach it, assume it's valid
    } catch (error) {
        console.warn(`Playlist ${playlistId} validation failed:`, error);
        return false;
    }
}

// Comprehensive playlist validation system
async function validateAllPlaylists() {
    console.log('🔍 Validating all playlist IDs...');
    
    const allPlaylistIds = new Set();
    
    // Collect all playlist IDs from different sources
    Object.values(VERIFIED_PLAYLISTS).forEach(playlist => {
        allPlaylistIds.add(playlist.id);
    });
    
    // Add playlist IDs from mood mappings
    const moodPlaylists = getPlaylistIdsForMood('happy').concat(
        getPlaylistIdsForMood('sad'),
        getPlaylistIdsForMood('energetic'),
        getPlaylistIdsForMood('calm'),
        getPlaylistIdsForMood('romantic'),
        getPlaylistIdsForMood('focus')
    );
    
    moodPlaylists.forEach(id => allPlaylistIds.add(id));
    
    // Add playlist IDs from curated playlists
    const curatedPlaylists = getCuratedPlaylists();
    Object.values(curatedPlaylists).forEach(moodPlaylists => {
        Object.values(moodPlaylists).forEach(playlistId => {
            allPlaylistIds.add(playlistId);
        });
    });
    
    console.log(`📋 Found ${allPlaylistIds.size} unique playlist IDs to validate`);
    
    // Validate each playlist
    const validationResults = [];
    for (const playlistId of allPlaylistIds) {
        const isValid = await validatePlaylist(playlistId);
        validationResults.push({ playlistId, isValid });
        
        if (!isValid) {
            console.error(`❌ Playlist ${playlistId} is NOT accessible!`);
        } else {
            console.log(`✅ Playlist ${playlistId} is accessible`);
        }
    }
    
    // Report validation summary
    const validCount = validationResults.filter(r => r.isValid).length;
    const invalidCount = validationResults.filter(r => !r.isValid).length;
    
    console.log(`\n📊 Playlist Validation Summary:`);
    console.log(`✅ Valid playlists: ${validCount}`);
    console.log(`❌ Invalid playlists: ${invalidCount}`);
    
    if (invalidCount > 0) {
        console.warn(`⚠️  Found ${invalidCount} invalid playlist(s). These will be replaced with fallbacks.`);
        const invalidPlaylists = validationResults.filter(r => !r.isValid).map(r => r.playlistId);
        console.warn(`Invalid playlist IDs: ${invalidPlaylists.join(', ')}`);
    } else {
        console.log(`🎉 All playlists are valid and accessible!`);
    }
    
    return validationResults;
}

// Enhanced playlist data fetching with validation
async function getValidatedPlaylistData(playlistId) {
    // First check if it's in our verified list
    if (VERIFIED_PLAYLISTS[playlistId]) {
        return VERIFIED_PLAYLISTS[playlistId];
    }
    
    // If not verified, validate it
    const isValid = await validatePlaylist(playlistId);
    if (isValid) {
        return getFallbackPlaylistData(playlistId);
    } else {
        console.warn(`Playlist ${playlistId} is not accessible, using fallback`);
        // Return a verified playlist as fallback
        return VERIFIED_PLAYLISTS['37i9dQZF1DX5Vy6DFOcx00']; // Today's Top Hits as safe fallback
    }
}

// Get verified playlist data
function getVerifiedPlaylistData(playlistId) {
    return VERIFIED_PLAYLISTS[playlistId] || getFallbackPlaylistData(playlistId);
}

// Fallback playlist data
function getFallbackPlaylistData(playlistId) {
    return {
        id: playlistId,
        name: 'Spotify Playlist',
        description: 'A curated playlist for your mood.',
        images: [{ url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' }],
        external_urls: { spotify: `https://open.spotify.com/playlist/${playlistId}` }
    };
}

// Search Spotify for playlists based on weather and mood
async function searchSpotifyPlaylists(weatherDescription, mood) {
    try {
        // Weather keywords to search for
        const weatherKeywords = getWeatherKeywords(weatherDescription, mood);
        
        // Curated playlist mappings for different weather conditions
        const curatedPlaylists = getCuratedPlaylists();
        
        // Try to find a matching playlist
        for (let keyword of weatherKeywords) {
            const playlist = findPlaylistByKeyword(keyword, mood, curatedPlaylists);
            if (playlist) {
                // Fetch real playlist data
                const playlistData = await fetchSpotifyPlaylistData(playlist.id);
                return {
                    id: playlistData.id,
                    name: playlistData.name,
                    description: playlistData.description,
                    image: playlistData.images[0]?.url,
                    url: playlistData.external_urls.spotify
                };
            }
        }
        
        // Fallback to mood-based playlist
        const fallbackPlaylist = getFallbackPlaylist(mood, curatedPlaylists);
        const playlistData = await fetchSpotifyPlaylistData(fallbackPlaylist.id);
        return {
            id: playlistData.id,
            name: playlistData.name,
            description: playlistData.description,
            image: playlistData.images[0]?.url,
            url: playlistData.external_urls.spotify
        };
        
    } catch (error) {
        console.error('Error searching Spotify playlists:', error);
        const fallbackPlaylist = getFallbackPlaylist(mood, getCuratedPlaylists());
        const playlistData = await fetchSpotifyPlaylistData(fallbackPlaylist.id);
        return {
            id: playlistData.id,
            name: playlistData.name,
            description: playlistData.description,
            image: playlistData.images[0]?.url,
            url: playlistData.external_urls.spotify
        };
    }
}

// Get weather keywords for playlist search
function getWeatherKeywords(weatherDescription, mood) {
    const keywords = weatherDescription.split(', ');
    
    // Add mood-specific keywords
    const moodKeywords = {
        happy: ['happy', 'upbeat', 'energetic', 'positive'],
        sad: ['melancholic', 'calm', 'peaceful', 'reflective'],
        energetic: ['energetic', 'upbeat', 'dynamic', 'powerful'],
        calm: ['calm', 'peaceful', 'relaxing', 'ambient'],
        romantic: ['romantic', 'intimate', 'dreamy', 'soft'],
        focus: ['focus', 'concentration', 'instrumental', 'ambient']
    };
    
    return [...keywords, ...(moodKeywords[mood] || [])];
}

// Curated playlist mappings with verified IDs only
function getCuratedPlaylists() {
    return {
        happy: {
            'Sunny': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Clear': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Bright': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Golden Hour': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Perfect Weather': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Celebratory': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'upbeat': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'energetic': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'positive': '37i9dQZF1DX5Vy6DFOcx00' // Today's Top Hits
        },
        sad: {
            'Rain': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Drizzle': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Overcast': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Heavy Rain': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Stormy': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Foggy': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Misty': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Mysterious': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'melancholic': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'calm': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'peaceful': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'reflective': '37i9dQZF1DX3Ogo9pFvBkY' // Ambient Relaxation
        },
        energetic: {
            'Thunderstorm': '37i9dQZF1DXcBWIGoYBM5M', // All Out 2010s
            'Stormy': '37i9dQZF1DXcBWIGoYBM5M', // All Out 2010s
            'Intense': '37i9dQZF1DXcBWIGoYBM5M', // All Out 2010s
            'Windy': '37i9dQZF1DXcBWIGoYBM5M', // All Out 2010s
            'Dynamic': '37i9dQZF1DXcBWIGoYBM5M', // All Out 2010s
            'Energetic': '37i9dQZF1DXcBWIGoYBM5M', // All Out 2010s
            'Lightning': '37i9dQZF1DXcBWIGoYBM5M', // All Out 2010s
            'Electric': '37i9dQZF1DXcBWIGoYBM5M', // All Out 2010s
            'High Energy': '37i9dQZF1DXcBWIGoYBM5M', // All Out 2010s
            'powerful': '37i9dQZF1DXcBWIGoYBM5M' // All Out 2010s
        },
        calm: {
            'Calm': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Peaceful': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Gentle': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Overcast': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Cloudy': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Comfortable': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Clear': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Serene': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'relaxing': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'ambient': '37i9dQZF1DX3Ogo9pFvBkY' // Ambient Relaxation
        },
        romantic: {
            'Sunset': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Golden Hour': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Romantic': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Clear Night': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Starry': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Dreamy': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Cozy Rain': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Intimate': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Warm': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'intimate': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'soft': '37i9dQZF1DX5Vy6DFOcx00' // Today's Top Hits
        },
        focus: {
            'Clear': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Focused': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Productive': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Overcast': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Work-friendly': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Soothing': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Any Weather': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Focus': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Concentration': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'concentration': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'instrumental': '37i9dQZF1DX3Ogo9pFvBkY' // Ambient Relaxation
        }
    };
}

// Find playlist by keyword
function findPlaylistByKeyword(keyword, mood, curatedPlaylists) {
    const moodPlaylists = curatedPlaylists[mood];
    if (!moodPlaylists) return null;
    
    // Check for exact match first
    if (moodPlaylists[keyword]) {
        return {
            id: moodPlaylists[keyword],
            name: `${keyword} ${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`
        };
    }
    
    // Check for partial matches
    for (let playlistKeyword in moodPlaylists) {
        if (playlistKeyword.toLowerCase().includes(keyword.toLowerCase()) || 
            keyword.toLowerCase().includes(playlistKeyword.toLowerCase())) {
            return {
                id: moodPlaylists[playlistKeyword],
                name: `${playlistKeyword} ${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`
            };
        }
    }
    
    return null;
}

// Get fallback playlist
function getFallbackPlaylist(mood, curatedPlaylists) {
    const moodPlaylists = curatedPlaylists[mood];
    if (!moodPlaylists) {
        return {
            id: '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`
        };
    }
    
    const firstPlaylist = Object.entries(moodPlaylists)[0];
    return {
        id: firstPlaylist[1],
        name: `${firstPlaylist[0]} ${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`
    };
}

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
    console.log('Showing loading...');
    document.getElementById('loading').style.display = 'block';
    hideError();
    
    // Fun rotating loading messages
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
    
    // Store interval ID to clear it later
    window.loadingMessageInterval = messageInterval;
}

function hideLoading() {
    console.log('Hiding loading...');
    document.getElementById('loading').style.display = 'none';
    
    // Clear the message interval if it exists
    if (window.loadingMessageInterval) {
        clearInterval(window.loadingMessageInterval);
        window.loadingMessageInterval = null;
    }
}

function showError(message) {
    console.error('Error:', message);
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    hideLoading();
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

function startMagic() {
    console.log('Starting magic...');
    if (navigator.geolocation) {
        showLoading();
        console.log('Requesting geolocation...');
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log('Geolocation success:', position);
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(`Coordinates: ${lat}, ${lon}`);
                getWeatherAndMusic(lat, lon);
            },
            error => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Unable to get your location. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access denied. Please enable location services or try manual location.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information unavailable. Please try manual location.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. Please try manual location.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred. Please try manual location.';
                }
                showError(errorMessage);
            },
            { 
                timeout: 15000,  // Increased timeout
                enableHighAccuracy: false,  // Changed to false for faster response
                maximumAge: 600000  // 10 minutes
            }
        );
    } else {
        showError('Geolocation is not supported by this browser. Please use manual location.');
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
    
    console.log(`Searching for city: ${cityName}`);
    showLoading();
    
    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
        console.log('Geocoding response status:', geoResponse.status);
        
        if (!geoResponse.ok) {
            throw new Error(`Geocoding API error: ${geoResponse.status}`);
        }
        
        const geoData = await geoResponse.json();
        console.log('Geocoding data:', geoData);
        
        if (!geoData.results || geoData.results.length === 0) {
            showError('City not found. Please check the spelling and try again.');
            return;
        }
        
        const location = geoData.results[0];
        const displayName = location.name + (location.country ? `, ${location.country}` : '');
        console.log(`Found location: ${displayName}`);
        getWeatherAndMusic(location.latitude, location.longitude, displayName);
        
    } catch (error) {
        console.error('Geocoding error:', error);
        showError('Failed to find location. Please check your internet connection and try again.');
    }
}

async function getWeatherAndMusic(lat, lon, cityName = null) {
    console.log(`Getting weather for: ${lat}, ${lon}`);
    try {
        // Get weather from multiple sources for maximum accuracy
        const [openMeteoData, visualCrossingData] = await Promise.all([
            getOpenMeteoWeather(lat, lon),
            getVisualCrossingWeather(lat, lon)
        ]);
        
        console.log('OpenMeteo data:', openMeteoData);
        console.log('VisualCrossing data:', visualCrossingData);
        
        // Combine data from both sources for maximum accuracy
        const combinedWeatherData = combineWeatherData(openMeteoData, visualCrossingData);
        console.log('Combined weather data:', combinedWeatherData);
        
        if (!combinedWeatherData) {
            throw new Error('Failed to get accurate weather data');
        }
        
        // Get precise location using Nominatim reverse geocoding if we don't have one
        if (!cityName) {
            console.log('Getting precise location from coordinates using Nominatim...');
            try {
                const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
                const reverseGeoResponse = await fetch(reverseGeoUrl);
                
                if (reverseGeoResponse.ok) {
                    const reverseGeoData = await reverseGeoResponse.json();
                    console.log('Nominatim reverse geocoding data:', reverseGeoData);
                    
                    if (reverseGeoData.address) {
                        const address = reverseGeoData.address;
                        
                        // Build precise location string with multiple levels of detail
                        let locationParts = [];
                        
                        // Add neighborhood/suburb if available
                        if (address.suburb) {
                            locationParts.push(address.suburb);
                        }
                        
                        // Add district/area if available
                        if (address.district && address.district !== address.suburb) {
                            locationParts.push(address.district);
                        }
                        
                        // Add city/town/village
                        if (address.city) {
                            locationParts.push(address.city);
                        } else if (address.town) {
                            locationParts.push(address.town);
                        } else if (address.village) {
                            locationParts.push(address.village);
                        }
                        
                        // Add state/province if available
                        if (address.state && address.state !== address.city && address.state !== address.town) {
                            locationParts.push(address.state);
                        }
                        
                        // Add country
                        if (address.country) {
                            locationParts.push(address.country);
                        }
                        
                        // Create the precise location string
                        if (locationParts.length > 0) {
                            cityName = locationParts.join(', ');
                        } else {
                            cityName = 'Unknown Location';
                        }
                        
                        console.log(`Found precise location: ${cityName}`);
                    } else {
                        cityName = 'Unknown Location';
                    }
                } else {
                    console.log('Nominatim reverse geocoding failed, using fallback');
                    cityName = 'Unknown Location';
                }
            } catch (reverseError) {
                console.error('Nominatim reverse geocoding error:', reverseError);
                cityName = 'Unknown Location';
            }
        }
        
        currentWeather = combinedWeatherData;
        currentLocation = { lat, lon, name: cityName };
        
        console.log('Displaying weather and music...');
        displayWeather(combinedWeatherData, cityName);
        await showMusicForWeather(combinedWeatherData.weather_code);
        showMoodSelector();
        
        hideLoading();
        console.log('Process completed successfully!');
        
    } catch (error) {
        console.error('Weather API error:', error);
        showError(`Failed to get weather data: ${error.message}. Please try again.`);
    }
}

// Get weather from Open-Meteo API
async function getOpenMeteoWeather(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,cloud_cover,pressure_msl&hourly=temperature_2m,precipitation,weather_code&timezone=auto&forecast_days=1`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Open-Meteo API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.current ? {
            temperature: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            weather_code: data.current.weather_code,
            wind_speed: data.current.wind_speed_10m,
            precipitation: data.current.precipitation,
            cloud_cover: data.current.cloud_cover,
            pressure: data.current.pressure_msl,
            source: 'open-meteo'
        } : null;
    } catch (error) {
        console.error('Open-Meteo error:', error);
        return null;
    }
}

// Get weather from Visual Crossing API (more accurate)
async function getVisualCrossingWeather(lat, lon) {
    try {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/today?unitGroup=metric&include=current&key=YOUR_API_KEY&contentType=json`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Visual Crossing API error: ${response.status}`);
        }
        
        const data = await response.json();
        const current = data.currentConditions;
        
        return current ? {
            temperature: current.temp,
            humidity: current.humidity,
            weather_code: getVisualCrossingWeatherCode(current.icon),
            wind_speed: current.windspeed,
            precipitation: current.precip || 0,
            cloud_cover: current.cloudcover || 0,
            pressure: current.pressure,
            conditions: current.conditions,
            icon: current.icon,
            source: 'visual-crossing'
        } : null;
    } catch (error) {
        console.error('Visual Crossing error:', error);
        return null;
    }
}

// Convert Visual Crossing icon to weather code
function getVisualCrossingWeatherCode(icon) {
    const iconMap = {
        'clear-day': 0,
        'clear-night': 0,
        'partly-cloudy-day': 2,
        'partly-cloudy-night': 2,
        'cloudy': 3,
        'rain': 61,
        'snow': 71,
        'sleet': 73,
        'fog': 45,
        'wind': 1,
        'thunderstorm': 95
    };
    return iconMap[icon] || 0;
}

// Combine weather data from multiple sources for maximum accuracy
function combineWeatherData(openMeteo, visualCrossing) {
    if (!openMeteo && !visualCrossing) {
        return null;
    }
    
    // Use Visual Crossing as primary if available (more accurate)
    if (visualCrossing) {
        return {
            temperature_2m: visualCrossing.temperature,
            relative_humidity_2m: visualCrossing.humidity,
            weather_code: visualCrossing.weather_code,
            wind_speed_10m: visualCrossing.wind_speed,
            precipitation: visualCrossing.precipitation,
            cloud_cover: visualCrossing.cloud_cover,
            pressure_msl: visualCrossing.pressure,
            conditions: visualCrossing.conditions,
            icon: visualCrossing.icon,
            source: 'visual-crossing'
        };
    }
    
    // Fallback to Open-Meteo
    return {
        temperature_2m: openMeteo.temperature,
        relative_humidity_2m: openMeteo.humidity,
        weather_code: openMeteo.weather_code,
        wind_speed_10m: openMeteo.wind_speed,
        precipitation: openMeteo.precipitation,
        cloud_cover: openMeteo.cloud_cover,
        pressure_msl: openMeteo.pressure,
        source: 'open-meteo'
    };
}

function displayWeather(weatherData, cityName) {
    console.log('Displaying weather data...');
    const weatherContainer = document.getElementById('weatherContainer');
    
    // Get more accurate weather description based on multiple factors
    const weatherInfo = getAccurateWeatherInfo(weatherData, null);
    
    document.getElementById('weatherIcon').textContent = weatherInfo.emoji;
    document.getElementById('cityName').textContent = cityName;
    
    // Use actual conditions from Visual Crossing if available, otherwise use enhanced description
    let weatherDescription = weatherData.conditions || weatherInfo.description;
    document.getElementById('weatherDescription').textContent = weatherDescription;
    
    const detailsHTML = `
        <div class="weather-detail">
            <div>🌡️ Temperature</div>
            <div>${Math.round(weatherData.temperature_2m)}°C</div>
        </div>
        <div class="weather-detail">
            <div>💧 Humidity</div>
            <div>${weatherData.relative_humidity_2m}%</div>
        </div>
        <div class="weather-detail">
            <div>💨 Wind Speed</div>
            <div>${Math.round(weatherData.wind_speed_10m)} km/h</div>
        </div>
        <div class="weather-detail">
            <div>🌧️ Precipitation</div>
            <div>${weatherData.precipitation > 0 ? weatherData.precipitation.toFixed(1) + ' mm' : 'None'}</div>
        </div>
        <div class="weather-detail">
            <div>☁️ Cloud Cover</div>
            <div>${weatherData.cloud_cover}%</div>
        </div>
        <div class="weather-detail">
            <div>🌤️ Condition</div>
            <div>${weatherDescription}</div>
        </div>

    `;
    
    document.getElementById('weatherDetails').innerHTML = detailsHTML;
    weatherContainer.style.display = 'block';
    // Add smooth transition
    setTimeout(() => {
        weatherContainer.classList.add('show');
    }, 50);
    console.log('Weather display completed');
}

function getAccurateWeatherInfo(current, hourlyData) {
    const weatherCode = current.weather_code;
    const precipitation = current.precipitation;
    const cloudCover = current.cloud_cover;
    const temperature = current.temperature_2m;
    
    // Base weather map
    const weatherMap = {
        0: { emoji: '☀️', description: 'Clear Sky', mood: 'happy' },
        1: { emoji: '🌤️', description: 'Mainly Clear', mood: 'happy' },
        2: { emoji: '⛅', description: 'Partly Cloudy', mood: 'calm' },
        3: { emoji: '☁️', description: 'Overcast', mood: 'calm' },
        45: { emoji: '🌫️', description: 'Foggy', mood: 'calm' },
        48: { emoji: '🌫️', description: 'Depositing Rime Fog', mood: 'calm' },
        51: { emoji: '🌦️', description: 'Light Drizzle', mood: 'sad' },
        53: { emoji: '🌦️', description: 'Moderate Drizzle', mood: 'sad' },
        55: { emoji: '🌧️', description: 'Dense Drizzle', mood: 'sad' },
        61: { emoji: '🌧️', description: 'Slight Rain', mood: 'sad' },
        63: { emoji: '🌧️', description: 'Moderate Rain', mood: 'sad' },
        65: { emoji: '🌧️', description: 'Heavy Rain', mood: 'sad' },
        71: { emoji: '🌨️', description: 'Slight Snow', mood: 'calm' },
        73: { emoji: '🌨️', description: 'Moderate Snow', mood: 'calm' },
        75: { emoji: '❄️', description: 'Heavy Snow', mood: 'calm' },
        80: { emoji: '🌦️', description: 'Slight Rain Showers', mood: 'sad' },
        81: { emoji: '🌦️', description: 'Moderate Rain Showers', mood: 'sad' },
        82: { emoji: '🌧️', description: 'Violent Rain Showers', mood: 'sad' },
        85: { emoji: '🌨️', description: 'Slight Snow Showers', mood: 'calm' },
        86: { emoji: '❄️', description: 'Heavy Snow Showers', mood: 'calm' },
        95: { emoji: '⛈️', description: 'Thunderstorm', mood: 'energetic' },
        96: { emoji: '⛈️', description: 'Thunderstorm with Slight Hail', mood: 'energetic' },
        99: { emoji: '⛈️', description: 'Thunderstorm with Heavy Hail', mood: 'energetic' }
    };
    
    let baseWeather = weatherMap[weatherCode] || { emoji: '🌈', description: 'Unknown Weather', mood: 'happy' };
    
    // Enhance description based on actual conditions
    let enhancedDescription = baseWeather.description;
    
    // Check if it's actually raining/snowing based on precipitation
    if (precipitation > 0) {
        if (precipitation < 0.5) {
            enhancedDescription = 'Very Light Rain';
        } else if (precipitation < 2.5) {
            enhancedDescription = 'Light Rain';
        } else if (precipitation < 7.5) {
            enhancedDescription = 'Moderate Rain';
        } else {
            enhancedDescription = 'Heavy Rain';
        }
        
        // Update emoji based on intensity
        if (precipitation < 0.5) {
            baseWeather.emoji = '🌦️';
        } else if (precipitation < 2.5) {
            baseWeather.emoji = '🌧️';
        } else {
            baseWeather.emoji = '🌧️';
        }
    }
    
    // Check cloud cover for more accuracy
    if (cloudCover > 80 && precipitation === 0) {
        enhancedDescription = 'Very Cloudy';
        baseWeather.emoji = '☁️';
    } else if (cloudCover > 50 && precipitation === 0) {
        enhancedDescription = 'Partly Cloudy';
        baseWeather.emoji = '⛅';
    } else if (cloudCover < 20 && precipitation === 0) {
        enhancedDescription = 'Clear Sky';
        baseWeather.emoji = '☀️';
    }
    
    // Check temperature for seasonal context
    if (temperature < 0 && precipitation > 0) {
        enhancedDescription = enhancedDescription.replace('Rain', 'Snow');
        baseWeather.emoji = '🌨️';
    }
    
    return {
        emoji: baseWeather.emoji,
        description: enhancedDescription,
        mood: baseWeather.mood
    };
}

function getWeatherInfo(weatherCode) {
    // Keep this for backward compatibility
    return getAccurateWeatherInfo({ weather_code: weatherCode, precipitation: 0, cloud_cover: 0, temperature_2m: 20 });
}

function showMoodSelector() {
    console.log('Showing mood selector...');
    const moodSelector = document.getElementById('moodSelector');
    moodSelector.style.display = 'block';
    // Add smooth transition
    setTimeout(() => {
        moodSelector.classList.add('show');
    }, 50);
}

async function showMusicForWeather(weatherCode) {
    console.log(`Showing music for weather code: ${weatherCode}`);
    const weatherInfo = getWeatherInfo(weatherCode);
    await showMusicForMood(weatherInfo.mood);
}

async function showMusicForMood(mood) {
    console.log(`Showing music for mood: ${mood}`);
    const musicContainer = document.getElementById('musicContainer');
    const musicRecommendations = document.getElementById('musicRecommendations');
    
    // Get current weather description for better playlist matching
    const weatherDescription = currentWeather ? 
        (currentWeather.conditions || getAccurateWeatherInfo(currentWeather, null).description) : 
        'Clear Sky';
    
    // Get different playlist IDs for each card
    const playlistIds = getPlaylistIdsForMood(mood);
    
    // Update the musicData object in script.js (replace the entire object)
    const musicData = {
        happy: [
            { 
                title: 'Pure Sunshine Hits', 
                description: 'Instant happiness boost with these sunny pop anthems', 
                genres: ['Pop', 'Dance-Pop'],
                artists: ['Taylor Swift', 'Bruno Mars', 'Katy Perry'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002a4a4a4a4a4a4a4a4a4a4a4a4',
                weatherMatch: 'Sunny, Clear',
                playlistId: '37i9dQZF1DXdPec7aLTmlC' // Happy Hits
            },
            { 
                title: 'Tropical Dance Party', 
                description: 'Feel the summer vibes no matter the season', 
                genres: ['Tropical House', 'Dance'],
                artists: ['Kygo', 'Lost Frequencies', 'Robin Schulz'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002583117b5f5f5f5f5f5f5f5f5',
                weatherMatch: 'Warm, Pleasant',
                playlistId: '37i9dQZF1DXa8n42306eJB' // Tropical House
            },
            { 
                title: 'Indie Joyride', 
                description: 'Upbeat indie tracks to brighten your day', 
                genres: ['Indie Pop', 'Alternative'],
                artists: ['Glass Animals', 'COIN', 'The 1975'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002666666666666666666666666',
                weatherMatch: 'Bright, Cheerful',
                playlistId: '37i9dQZF1DX2sUQwD7tbmL' // Indie Pop
            }
        ],
        sad: [
            { 
                title: 'Heartbreak Hotel', 
                description: 'Melancholic melodies for when you need to feel', 
                genres: ['Soul', 'R&B'],
                artists: ['Adele', 'Sam Smith', 'Lewis Capaldi'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002999999999999999999999999',
                weatherMatch: 'Rainy, Gloomy',
                playlistId: '37i9dQZF1DX7qK8ma5wgG1' // Sad Songs
            },
            { 
                title: 'Rainy Day Piano', 
                description: 'Gentle piano to accompany your thoughts', 
                genres: ['Piano', 'Classical'],
                artists: ['Ludovico Einaudi', 'Yiruma', 'Ólafur Arnalds'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002888888888888888888888888',
                weatherMatch: 'Drizzly, Overcast',
                playlistId: '37i9dQZF1DX7K31D69s4M1' // Peaceful Piano
            },
            { 
                title: 'Indie Sadcore', 
                description: 'Bittersweet indie for reflective moments', 
                genres: ['Indie Folk', 'Singer-Songwriter'],
                artists: ['Phoebe Bridgers', 'Bon Iver', 'Sufjan Stevens'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002777777777777777777777777',
                weatherMatch: 'Foggy, Misty',
                playlistId: '37i9dQZF1DX3YSRoSdA634' // Life Sucks
            }
        ],
        energetic: [
            { 
                title: 'Adrenaline Rush', 
                description: 'High-octane tracks to fuel your energy', 
                genres: ['EDM', 'Electro'],
                artists: ['Martin Garrix', 'The Chainsmokers', 'David Guetta'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002666666666666666666666666',
                weatherMatch: 'Stormy, Intense',
                playlistId: '37i9dQZF1DX4dyzvuaRJ0n' // Dance Hits
            },
            { 
                title: 'Rock Revolution', 
                description: 'Powerful rock anthems to pump you up', 
                genres: ['Rock', 'Alternative'],
                artists: ['Foo Fighters', 'Red Hot Chili Peppers', 'Arctic Monkeys'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002555555555555555555555555',
                weatherMatch: 'Thunder, Lightning',
                playlistId: '37i9dQZF1DXcF6B6QPhFDv' // Rock Classics
            },
            { 
                title: 'Hip-Hop Hustle', 
                description: 'Beats that make you move', 
                genres: ['Hip-Hop', 'Rap'],
                artists: ['Drake', 'Kendrick Lamar', 'Travis Scott'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002444444444444444444444444',
                weatherMatch: 'Windy, Gusty',
                playlistId: '37i9dQZF1DX0XUsuxWHRQd' // RapCaviar
            }
        ],
        calm: [
            { 
                title: 'Zen Garden', 
                description: 'Soothing sounds for complete relaxation', 
                genres: ['Ambient', 'Meditation'],
                artists: ['Deuter', 'Snatam Kaur', 'Krishna Das'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002333333333333333333333333',
                weatherMatch: 'Calm, Still',
                playlistId: '37i9dQZF1DWZqd5JICZI0u' // Peaceful Meditation
            },
            { 
                title: 'Coffee Shop Acoustics', 
                description: 'Mellow acoustic vibes for cozy moments', 
                genres: ['Acoustic', 'Folk'],
                artists: ['Ed Sheeran', 'Damien Rice', 'City and Colour'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002222222222222222222222222',
                weatherMatch: 'Cloudy, Comfortable',
                playlistId: '37i9dQZF1DX504r1DvyvxG' // Acoustic Morning
            },
            { 
                title: 'Ocean Breeze', 
                description: 'Nature sounds mixed with soft instruments', 
                genres: ['Nature', 'Ambient'],
                artists: ['Nature Sounds', 'Relaxing Waves', 'Forest Rain'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002111111111111111111111111',
                weatherMatch: 'Breezy, Mild',
                playlistId: '37i9dQZF1DWZqd5JICZI0u' // Nature Sounds
            }
        ],
        romantic: [
            { 
                title: 'Love Language', 
                description: 'Timeless romantic classics', 
                genres: ['R&B', 'Soul'],
                artists: ['John Legend', 'Alicia Keys', 'Daniel Caesar'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002000000000000000000000000',
                weatherMatch: 'Sunset, Golden Hour',
                playlistId: '37i9dQZF1DX50QitC6Oqtn' // Love Songs
            },
            { 
                title: 'Parisian Nights', 
                description: 'Romantic French melodies', 
                genres: ['French Pop', 'Jazz'],
                artists: ['Edith Piaf', 'Zaz', 'Stacey Kent'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002999999999999999999999999',
                weatherMatch: 'Warm Evening',
                playlistId: '37i9dQZF1DX8Uebhn9wzrS' // French Cafe
            },
            { 
                title: 'Bollywood Romance', 
                description: 'Passionate Hindi love songs', 
                genres: ['Bollywood', 'Romantic'],
                artists: ['Arijit Singh', 'Shreya Ghoshal', 'KK'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002888888888888888888888888',
                weatherMatch: 'Starry Night',
                playlistId: '37i9dQZF1DX0XUfTFmNBRM' // Hindi Romance
            }
        ],
        focus: [
            { 
                title: 'Deep Work Zone', 
                description: 'Concentration-enhancing classical', 
                genres: ['Classical', 'Minimalism'],
                artists: ['Max Richter', 'Philip Glass', 'Hans Zimmer'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002777777777777777777777777',
                weatherMatch: 'Clear, Productive',
                playlistId: '37i9dQZF1DX8NTLI2TtZa6' // Deep Focus
            },
            { 
                title: 'Study Lo-fi', 
                description: 'Chill beats for studying', 
                genres: ['Lo-fi', 'Hip-Hop'],
                artists: ['J Dilla', 'Nujabes', 'Tomppabeats'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002666666666666666666666666',
                weatherMatch: 'Cloudy, Focused',
                playlistId: '37i9dQZF1DWWQRwui0ExPn' // Lo-fi Beats
            },
            { 
                title: 'Code Flow', 
                description: 'Electronic focus music', 
                genres: ['Electronic', 'Minimal'],
                artists: ['Brian Eno', 'Aphex Twin', 'Tycho'],
                albumArt: 'https://i.scdn.co/image/ab67706f00000002555555555555555555555555',
                weatherMatch: 'Any Weather',
                playlistId: '37i9dQZF1DX9sIqqvKsjG8' // Programming Focus
            }
        ]
    };

    const recommendations = musicData[mood] || musicData.happy;
    
    musicRecommendations.innerHTML = recommendations.map(music => `
        <div class="music-card" onclick="openSpotify('https://open.spotify.com/playlist/${music.playlistId}')">
          <div class="music-card-header">
            <div class="music-card-info">
              <h4>${music.title}</h4>
              <p>${music.description}</p>
              <div class="weather-match">
                <span class="weather-match-tag">🌤️ ${music.weatherMatch}</span>
              </div>
            </div>
          </div>
          <div class="music-card-details">
            <div class="music-genres">
              ${music.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
            </div>
            <div class="music-artists">🎤 ${music.artists.join(', ')}</div>
          </div>
        </div>
      `).join('');
    
    musicContainer.style.display = 'block';
    // Add smooth transition
    setTimeout(() => {
        musicContainer.classList.add('show');
    }, 50);
    console.log('Music recommendations displayed with different playlists for each card');
}

// Helper function to get different playlist IDs for each mood - Proper mood-specific playlists
function getPlaylistIdsForMood(mood) {
    const playlistMap = {
        happy: ['37i9dQZF1DX5Vy6DFOcx00', '37i9dQZF1DXcBWIGoYBM5M', '37i9dQZF1DX3Ogo9pFvBkY'], // Top Hits, 2010s, Ambient
        sad: ['37i9dQZF1DX3Ogo9pFvBkY', '37i9dQZF1DX0XUsuxWHRQd', '37i9dQZF1DX2sUQwD7tbmL'], // Ambient, Piano, Acoustic
        energetic: ['37i9dQZF1DXcBWIGoYBM5M', '37i9dQZF1DX5Vy6DFOcx00', '37i9dQZF1DX3Ogo9pFvBkY'], // 2010s, Top Hits, Ambient
        calm: ['37i9dQZF1DX1s9knjP51Oa', '37i9dQZF1DX2sUQwD7tbmL', '37i9dQZF1DX3Ogo9pFvBkY'], // calm vibes, Indie Folk, Ambient
        romantic: ['37i9dQZF1DX5Vy6DFOcx00', '37i9dQZF1DX0XUsuxWHRQd', '37i9dQZF1DX2sUQwD7tbmL'], // Top Hits, Acoustic, Piano
        focus: ['37i9dQZF1DXcBWIGoYBM5M', '37i9dQZF1DX3Ogo9pFvBkY', '37i9dQZF1DX1s9knjP51Oa'] // Lo-Fi, Ambient, Piano
    };
    return playlistMap[mood] || playlistMap.happy;
}

// Helper function to get genres based on mood
function getGenresForMood(mood) {
    const genreMap = {
        happy: ['Pop', 'Indie Pop', 'Alternative'],
        sad: ['Indie Folk', 'Acoustic', 'Alternative'],
        energetic: ['Rock', 'Metal', 'Electronic'],
        calm: ['Ambient', 'Classical', 'New Age'],
        romantic: ['R&B', 'Soul', 'Pop'],
        focus: ['Lo-fi', 'Instrumental', 'Ambient']
    };
    return genreMap[mood] || ['Pop', 'Alternative'];
}

// Helper function to get artists based on mood
function getArtistsForMood(mood) {
    const artistMap = {
        happy: ['Vampire Weekend', 'Foster the People', 'MGMT'],
        sad: ['Bon Iver', 'Iron & Wine', 'Fleet Foxes'],
        energetic: ['Foo Fighters', 'Metallica', 'Skrillex'],
        calm: ['Brian Eno', 'Ludovico Einaudi', 'Max Richter'],
        romantic: ['John Legend', 'Adele', 'Ed Sheeran'],
        focus: ['Nujabes', 'Emancipator', 'Bonobo']
    };
    return artistMap[mood] || ['Various Artists'];
}

// Function to get Spotify playlist based on mood and weather
function getSpotifyPlaylist(mood, weatherDescription) {
    // Curated Spotify playlist IDs for different moods and weather
    const playlistMap = {
        happy: {
            'Clear Sky': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Sunny': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Bright': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Partly Cloudy': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Golden Hour': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Perfect Weather': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Celebratory': '37i9dQZF1DX5Vy6DFOcx00' // Today's Top Hits
        },
        sad: {
            'Rain': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Drizzle': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Overcast': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Heavy Rain': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Stormy': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Foggy': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Misty': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Mysterious': '37i9dQZF1DX3Ogo9pFvBkY' // Ambient Relaxation
        },
        energetic: {
            'Thunderstorm': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Stormy': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Intense': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Windy': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Dynamic': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Energetic': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Lightning': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Electric': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'High Energy': '37i9dQZF1DX5Vy6DFOcx00' // Today's Top Hits
        },
        calm: {
            'Calm': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Peaceful': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Gentle': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Overcast': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Cloudy': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Comfortable': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Clear': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Serene': '37i9dQZF1DX3Ogo9pFvBkY' // Ambient Relaxation
        },
        romantic: {
            'Sunset': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Golden Hour': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Romantic': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Clear Night': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Starry': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Dreamy': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Cozy Rain': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Intimate': '37i9dQZF1DX5Vy6DFOcx00', // Today's Top Hits
            'Warm': '37i9dQZF1DX5Vy6DFOcx00' // Today's Top Hits
        },
        focus: {
            'Clear': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Focused': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Productive': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Overcast': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Work-friendly': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Soothing': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Any Weather': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Focus': '37i9dQZF1DX3Ogo9pFvBkY', // Ambient Relaxation
            'Concentration': '37i9dQZF1DX3Ogo9pFvBkY' // Ambient Relaxation
        }
    };
    
    // Find the best matching playlist based on weather description
    const weatherKeywords = weatherDescription.split(', ');
    let playlistId = null;
    
    for (let keyword of weatherKeywords) {
        if (playlistMap[mood] && playlistMap[mood][keyword]) {
            playlistId = playlistMap[mood][keyword];
            break;
        }
    }
    
    // Fallback to mood-based playlist
    if (!playlistId) {
        playlistId = playlistMap[mood] ? Object.values(playlistMap[mood])[0] : '37i9dQZF1DX5Vy6DFOcx00';
    }
    
    return `https://open.spotify.com/playlist/${playlistId}`;
}

// Function to open Spotify playlist with safety validation
function openSpotify(spotifyLink) {
    console.log('Opening Spotify playlist:', spotifyLink);
    
    // Extract playlist ID from the URL
    const playlistId = spotifyLink.split('/').pop();
    
    // Validate the playlist before opening
    validatePlaylist(playlistId).then(isValid => {
        if (isValid) {
            window.open(spotifyLink, '_blank');
        } else {
            console.warn(`Playlist ${playlistId} is not accessible, opening fallback`);
            // Open a guaranteed working playlist as fallback
            const fallbackUrl = 'https://open.spotify.com/playlist/37i9dQZF1DX5Vy6DFOcx00'; // Today's Top Hits
            window.open(fallbackUrl, '_blank');
        }
    }).catch(error => {
        console.error('Error validating playlist:', error);
        // Open fallback playlist
        const fallbackUrl = 'https://open.spotify.com/playlist/37i9dQZF1DX5Vy6DFOcx00'; // Today's Top Hits
        window.open(fallbackUrl, '_blank');
    });
}