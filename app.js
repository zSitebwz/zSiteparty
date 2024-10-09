// app.js
const video = document.getElementById('video');
const videoSource = document.getElementById('video-source');
const addAnimeButton = document.getElementById('add-anime');
const animeUrlInput = document.getElementById('anime-url');
const playlist = document.getElementById('playlist');

// Função para carregar a URL do vídeo
function loadVideo(url) {
    videoSource.src = url;
    video.load();
    video.play();
}

// Adiciona o evento para o botão
addAnimeButton.addEventListener('click', () => {
    const url = animeUrlInput.value.trim();
    if (url) {
        // Adiciona à playlist
        const listItem = document.createElement('li');
        listItem.textContent = url;
        listItem.addEventListener('click', () => loadVideo(url));
        playlist.appendChild(listItem);

        // Salva a URL no arquivo (simulação)
        saveUrl(url);

        animeUrlInput.value = '';
    }
});

// Função para salvar a URL em um arquivo (simulação)
function saveUrl(url) {
    fetch('save-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    }).then(response => {
        if (!response.ok) {
            console.error('Erro ao salvar a URL');
        }
    }).catch(error => {
        console.error('Erro:', error);
    });
}

// Função para buscar URLs armazenadas (simulação)
function fetchUrls() {
    fetch('urls.txt')
        .then(response => response.text())
        .then(data => {
            const urls = data.split('\n').filter(Boolean);
            urls.forEach(url => {
                const listItem = document.createElement('li');
                listItem.textContent = url;
                listItem.addEventListener('click', () => loadVideo(url));
                playlist.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar URLs:', error);
        });
}

// Carregar URLs ao iniciar
fetchUrls();
