import getPort, { portNumbers } from 'get-port';
import { WebSocketServer } from 'ws';
import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'node:path'
import crypto from 'node:crypto';
import { Client } from './websocket/client.js';

const port = await getPort({
    port: portNumbers(49152, 65535)
});
const wss = new WebSocketServer({
    port,
    handleProtocols: (protocols, req) => {
        return protocols.has('com.microsoft.minecraft.wsencrypt') ? 'com.microsoft.minecraft.wsencrypt' : false;
    }
});
const ecdh = crypto.createECDH('secp384r1');
ecdh.generateKeys();

const salt = crypto.randomBytes(16);

console.log(`Server started on port ${ port }`);

function sendAllRenderers(channel, data) {
    BrowserWindow.getAllWindows().forEach((window) => window.webContents.send(channel, data));
}

wss.on('connection', async (ws) => {
    if (wss.clients.size > 1) ws.close();

    sendAllRenderers('connection');

    const client = new Client(ws, ecdh);

    await client.enableEncryption(salt);
    client.subscribeEvent('PlayerDied');
    client.subscribeEvent('ItemUsed');
    client.subscribeEvent('PlayerMessage');
});

app.whenReady().then(() => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.resolve(import.meta.dirname, 'preload.js')
        }
    });

    window.loadFile(path.resolve(import.meta.dirname, 'wwwdist/index.html'));

    ipcMain.on('command', (event, command) => {
        Client.clients.forEach((client) => {
            client.execute(command);
        });
    });

    // TODO: handle multiple clients
    ipcMain.handle('command-with-response', (event, command) => {
        return Client.clients[0].execute(command);
    });

    // same as above but synchronously
    ipcMain.on('command-with-response', async (event, command) => {
        // I don't know why Electron doesn't like it if I send over the original Promise.
        event.returnValue = await Client.clients[0].execute(command);
    });

    ipcMain.handle('request-port', (event) => port);
});