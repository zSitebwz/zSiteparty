const addAnimeButton = document.getElementById('add-anime');
const animeUrlInput = document.getElementById('anime-url');
const playlist = document.getElementById('playlist');
const video = document.getElementById('video');
const videoSource = document.getElementById('video-source');

const socket = new WebSocket('ws://localhost:3000'); // URL do servidor WebSocket

socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    if (message.type === 'loadVideo') {
        loadVideo(message.url);
    } else if (message.type === 'play') {
        video.play();
    } else if (message.type === 'pause') {
        video.pause();
    } else if (message.type === 'seek') {
        video.currentTime = message.currentTime;
    }
};

addAnimeButton.addEventListener('click', () => {
    const url = animeUrlInput.value.trim();
    if (url) {
        // Adiciona à playlist
        const listItem = document.createElement('li');
        listItem.textContent = url;
        
        const playButton = document.createElement('button');
        playButton.textContent = 'Assistir';
        playButton.onclick = () => {
            loadVideo(url);
            socket.send(JSON.stringify({ type: 'loadVideo', url: url }));
        };

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.onclick = () => {
            playlist.removeChild(listItem);
        };

        listItem.appendChild(playButton);
        listItem.appendChild(removeButton);
        playlist.appendChild(listItem);

        // Limpa o campo de entrada
        animeUrlInput.value = '';
    }
});

function loadVideo(url) {
    // Atualiza a fonte do vídeo e carrega
    videoSource.src = url;
    video.load();
    video.play();
}

video.addEventListener('play', () => {
    socket.send(JSON.stringify({ type: 'play' }));
});

video.addEventListener('pause', () => {
    socket.send(JSON.stringify({ type: 'pause' }));
});

video.addEventListener('seeked', () => {
    socket.send(JSON.stringify({ type: 'seek', currentTime: video.currentTime }));
});
