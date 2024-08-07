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

    ipcMain.on('command', (event, command) => {
        console.log('c');
        wss.clients.forEach((ws) => {
            ws.send(JSON.stringify({
                header: {
                    version: 1,
                    requestId: crypto.randomUUID(),
                    messagePurpose: 'commandRequest',
                    messageType: 'commandRequest'
                },
                body: {
                    version: 1,
                    commandLine: command,
                    origin: {
                        type: 'player'
                    }
                }
            }));
        })
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});