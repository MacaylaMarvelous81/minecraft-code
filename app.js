import getPort, { portNumbers } from 'get-port';
import { WebSocketServer } from 'ws';
import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'node:path';
import crypto from "node:crypto";

const port = await getPort({
    port: portNumbers(49152, 65535)
});
const wss = new WebSocketServer({
    port
});
console.log(`Server started on port ${ port }`);

const key = await new Promise((resolve, reject) => {
    crypto.generateKeyPair('ec', {
        namedCurve: 'P-384'
    }, (err, publicKey, privateKey) => {
        if (err) {
            reject(err);
        } else {
            resolve({ publicKey, privateKey });
        }
    })
});

wss.on('connection', (ws) => {
    console.log('connection established');

    ws.on('message', (data) => {
        console.log(`recieved ${ data }`);
    });
});

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.resolve(import.meta.dirname, 'preload.js')
        }
    });

    window.loadFile(path.resolve(import.meta.dirname, 'wwwdist/index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});