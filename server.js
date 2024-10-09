const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const urlFilePath = 'urls.txt';

// Rota para salvar URLs
app.post('/save-url', (req, res) => {
    const { url } = req.body;
    fs.appendFile(urlFilePath, url + '\n', (err) => {
        if (err) {
            return res.status(500).send('Erro ao salvar a URL');
        }
        res.send('URL salva com sucesso');
    });
});

// Rota para obter URLs
app.get('/urls', (req, res) => {
    fs.readFile(urlFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler as URLs');
        }
        res.send(data);
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
