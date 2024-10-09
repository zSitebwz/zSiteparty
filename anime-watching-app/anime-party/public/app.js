// app.js
const socket = io();

// Função para adicionar um anime à playlist
document.getElementById('add-anime').addEventListener('click', () => {
    const animeUrl = document.getElementById('anime-url').value;
    if (animeUrl) {
        // Envia o URL para o servidor
        socket.emit('add-anime', animeUrl);
        document.getElementById('anime-url').value = ''; // Limpa o campo
    }
});

// Atualiza a playlist quando um novo anime é adicionado
socket.on('update-playlist', (animeUrl) => {
    const li = document.createElement('li');
    li.textContent = animeUrl;

    // Adiciona botão para selecionar
    li.addEventListener('click', () => {
        document.getElementById('video-source').src = animeUrl;
        document.getElementById('video').load();
        document.getElementById('start-watching').style.display = 'block'; // Mostra o botão
    });

    document.getElementById('playlist').appendChild(li);
});

// Começa a tocar o vídeo para todos os usuários
socket.on('start-playing', () => {
    const video = document.getElementById('video');
    video.play();
});

// Lida com o botão "Começar a Assistir"
document.getElementById('start-watching').addEventListener('click', () => {
    socket.emit('play-anime'); // Notifica todos para dar play
    const video = document.getElementById('video');
    video.play();
});
