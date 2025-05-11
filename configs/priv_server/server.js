const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const open = require('open');
const localtunnel = require('localtunnel');
const app = express();

const SERVER_DIR = 'C:/Users/LENOVO/Desktop/SERVER';
const urlsPath = path.join(SERVER_DIR, 'urls.txt');
const baseTxtPath = path.join(SERVER_DIR, 'base.txt');

app.use(express.json({ limit: '10mb' }));

let tunnel, baseUrl;
let shutdownInitiated = false;

function readHooks() {
    const lines = fs.readFileSync(urlsPath, 'utf-8').split(/\r?\n/);
    return { xano: lines[0], discord: lines[1] };
}

function sendStatus(active, url) {
    const { xano, discord } = readHooks();
    const body = JSON.stringify({ url, timestamp: new Date(), data: {}, active });
    fetch(xano, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    fetch(discord, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: body }) });
}

app.get('/', (req, res) => {
    fs.readFile(baseTxtPath, (err, data) => {
        if (err) return res.status(500).send('Missing base.txt');
        res.send(data.toString());
    });
});

app.get('/file/*', (req, res) => {
    const targetPath = path.join(SERVER_DIR, req.params[0]);
    if (!targetPath.startsWith(SERVER_DIR)) return res.status(403).send('Forbidden');
    fs.readFile(targetPath, (err, data) => {
        if (err) return res.status(404).send('File not found');
        res.send(data.toString());
    });
});

app.post('/file/*', (req, res) => {
    const targetPath = path.join(SERVER_DIR, req.params[0]);
    if (!targetPath.startsWith(SERVER_DIR)) return res.status(403).send('Forbidden');
    const content = Buffer.from(req.body.content, 'base64');
    fs.writeFile(targetPath, content, err => {
        if (err) return res.status(500).send('Write error');
        res.send('Saved');
    });
});

app.post('/console', (req, res) => {
    const forbidden = ['format', 'shutdown', 'rm', 'del', 'rd', 'reg', 'powershell'];
    const cmd = req.body.cmd;
    if (!cmd || forbidden.some(f => cmd.toLowerCase().includes(f))) {
        return res.status(403).send('Command blocked');
    }
    exec(cmd, (err, stdout, stderr) => {
        if (err) return res.status(500).send(stderr);
        res.send(stdout);
    });
});

app.all('/kill', (req, res) => {
    res.send('Shutting down...');
    shutdownInitiated = true;
    server.close(() => process.exit());
});

const server = app.listen(8080, async () => {
    tunnel = await localtunnel({ port: 8080, subdomain: 'srv' + Math.floor(Math.random() * 100000) });
    baseUrl = tunnel.url;
    sendStatus(true, baseUrl);
    console.log(`Server exposed at ${baseUrl}`);
    open(baseUrl);

    tunnel.on('close', () => console.log('Tunnel closed'));
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
    if (!shutdownInitiated) {
        sendStatus(false, baseUrl);
        shutdownInitiated = true;
        if (tunnel) tunnel.close();
        server.close(() => process.exit());
    }
}
