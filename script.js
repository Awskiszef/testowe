let player;
let currentTrack = null;
const playlist = document.getElementById('playlist');
const audioPlayer = document.getElementById('audioPlayer');
const currentSong = document.getElementById('currentSong');

// Inicjalizacja Spotify Web Playback SDK
window.onSpotifyWebPlaybackSDKReady = () => {
    player = new Spotify.Player({
        name: 'Zaawansowany Odtwarzacz',
        getOAuthToken: cb => {
            // Tutaj musisz zaimplementować logikę do pobrania tokenu OAuth od Spotify
            cb('TU_WSTAW_TOKEN'); // Przykładowy token, należy go zdobyć dynamicznie
        }
    });

    player.connect();
};

document.getElementById('searchButton').addEventListener('click', async () => {
    const link = document.getElementById('searchInput').value;
    if (link.includes('spotify')) {
        handleSpotifyLink(link);
    } else if (link.includes('youtube')) {
        handleYouTubeLink(link);
    } else {
        alert('Nieznany link. Wspierane są tylko linki do Spotify i YouTube.');
    }
});

function handleSpotifyLink(link) {
    let trackId = link.split('/track/')[1];
    if (trackId) {
        trackId = trackId.split('?')[0]; // Usuń dodatkowe parametry URL
        addTrackToPlaylist('Spotify Track', trackId);
    } else {
        alert('Niepoprawny link do Spotify.');
    }
}

function handleYouTubeLink(link) {
    const videoId = link.split('v=')[1];
    if (videoId) {
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition != -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }
        addTrackToPlaylist('YouTube Video', videoId);
    } else {
        alert('Niepoprawny link do YouTube.');
    }
}

function addTrackToPlaylist(title, id) {
    const item = document.createElement('div');
    item.classList.add('playlist-item');
    item.textContent = title;
    item.dataset.id = id;
    item.dataset.type = title.includes('Spotify') ? 'spotify' : 'youtube';
    item.addEventListener('click', playTrack);
    playlist.appendChild(item);
}

async function playTrack(e) {
    currentTrack = e.target;
    currentSong.textContent = currentTrack.textContent;
    
    if (currentTrack.dataset.type === 'spotify') {
        player.loadUri(`spotify:track:${currentTrack.dataset.id}`);
    } else if (currentTrack.dataset.type === 'youtube') {
        // Tutaj musisz zaimplementować logikę dla YouTube, np. używając ytdl-core lub innego API
        audioPlayer.src = `https://example.com/youtube-proxy/${currentTrack.dataset.id}`; // Placeholder dla API YouTube
        audioPlayer.play();
    }
}

// Kontrole odtwarzacza dla Spotify
player.addListener('player_state_changed', (state) => {
    if (state.paused) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
});

document.getElementById('play').addEventListener('click', () => player.resume());
document.getElementById('pause').addEventListener('click', () => player.pause());
document.getElementById('stop').addEventListener('click', () => {
    player.pause();
    audioPlayer.currentTime = 0;
});

document.getElementById('volume').addEventListener('input', (e) => {
    player.setVolume(parseFloat(e.target.value));
    audioPlayer.volume = e.target.value;
});