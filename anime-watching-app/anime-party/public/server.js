// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Configura a pasta pública para arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Cria ou lê a playlist do arquivo
const playlistFilePath = path.join(__dirname, 'playlist.json');

// Se o arquivo não existir, cria um novo
if (!fs.existsSync(playlistFilePath)) {
    fs.writeFileSync(playlistFilePath, JSON.stringify([]));
}

// Lê a playlist do arquivo
const getPlaylist = () => {
    return JSON.parse(fs.readFileSync(playlistFilePath));
};

// Salva a playlist no arquivo
const savePlaylist = (playlist) => {
    fs.writeFileSync(playlistFilePath, JSON.stringify(playlist));
};

// Lida com a atualização da playlist
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    // Envia a playlist existente para o novo usuário
    const currentPlaylist = getPlaylist();
    currentPlaylist.forEach(url => {
        socket.emit('update-playlist', url);
    });

    socket.on('add-anime', (animeUrl) => {
        const playlist = getPlaylist();
        playlist.push(animeUrl);
        savePlaylist(playlist);
        io.emit('update-playlist', animeUrl); // Envia para todos os usuários
    });

    socket.on('play-anime', () => {
        io.emit('start-playing'); // Notifica todos os usuários para dar play
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

// Inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
