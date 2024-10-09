const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const request = require('request');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Habilitar CORS para todas as origens
app.use(cors({
    origin: '*',
}));

let currentVideoUrl = '';
let isPlaying = false;
let currentTime = 0; // Armazena o tempo atual do vídeo

// Serve o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Configura a pasta pública para arquivos estáticos
app.use(express.static(path.join(__dirname)));

// WebSocket para lidar com a sincronização do vídeo
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    // Quando um novo usuário solicita a sincronização
    socket.on('request-sync', () => {
        socket.emit('sync-video', {
            url: currentVideoUrl,
            isPlaying,
            currentTime
        });
    });

    // Solicita o carregamento de um novo vídeo
    socket.on('request-load', (url) => {
        if (currentVideoUrl !== url) { // Carregar um novo vídeo se não for o mesmo
            currentVideoUrl = url;
            isPlaying = true; // Define o vídeo como reproduzindo ao carregar
            currentTime = 0; // Reinicia o tempo ao carregar um novo vídeo

            io.emit('load-video', { url: currentVideoUrl, isPlaying });
        }
    });

    // Sincroniza quando um usuário pausa o vídeo
    socket.on('pause-video', () => {
        isPlaying = false; // Atualiza o estado
        io.emit('pause-video');
    });

    // Sincroniza quando um usuário reproduz o vídeo
    socket.on('play-video', () => {
        isPlaying = true; // Atualiza o estado
        io.emit('play-video');
    });

    // Sincroniza quando um usuário pula o vídeo
    socket.on('video-seeked', (time) => {
        currentTime = time; // Atualiza o tempo atual
        socket.broadcast.emit('video-seeked', time); // Emite para os outros usuários
    });

    // Remove um vídeo da lista
    socket.on('remove-video', (url) => {
        io.emit('remove-video', url);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

// Proxy para reproduzir o vídeo (usando `request` para contornar CORS)
app.get('/proxy', (req, res) => {
    const url = req.query.url;
    request(url).pipe(res);
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
