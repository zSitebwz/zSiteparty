// public/script.js
const socket = io();

const addPlaylistButton = document.getElementById('addPlaylist');
const animeUrlInput = document.getElementById('animeUrl');
const videoContainer = document.getElementById('player');
const playlistContainer = document.getElementById('playlist');

addPlaylistButton.addEventListener('click', () => {
    const animeUrl = animeUrlInput.value;

    if (animeUrl) {
        socket.emit('addPlaylist', animeUrl);
        animeUrlInput.value = ''; // Limpa o campo de entrada após enviar
    } else {
        alert('Por favor, insira uma URL!');
    }
});

socket.on('playlistAdded', (url) => {
    // Adiciona a URL à lista da playlist
    const listItem = document.createElement('li');
    listItem.innerHTML = `<a href="#" onclick="playVideo('${url}')">${url}</a>`;
    playlistContainer.appendChild(listItem);
});

// Função para reproduzir o vídeo no player
function playVideo(url) {
    videoContainer.innerHTML = `<iframe width="560" height="315" src="${url}" frameborder="0" allowfullscreen></iframe>`;
}
