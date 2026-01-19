// Servidor simples para servir o history.jsonl com CORS
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HISTORY_FILE = '/Users/2a/.claude/history.jsonl';

const server = http.createServer((req, res) => {
    // Headers CORS para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/history.jsonl') {
        fs.readFile(HISTORY_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end('File not found');
                return;
            }
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(data);
        });
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
        });
        res.end('OK - history endpoint available at /history.jsonl');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`History file: ${HISTORY_FILE}`);
    console.log(`Endpoint: http://localhost:${PORT}/history.jsonl`);
});
