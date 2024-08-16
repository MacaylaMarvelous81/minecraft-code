import getPort, { portNumbers } from 'get-port';
import { WebSocketServer } from 'ws';
import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'node:path';
import crypto from "node:crypto";
import { buildSubscription, buildCommandRequest } from './mcws.js';

const commandRequests = {};

const port = await getPort({
    port: portNumbers(49152, 65535)
});
const wss = new WebSocketServer({
    port,
    handleProtocols: (protocols, req) => {
        return protocols.has('com.microsoft.minecraft.wsencrypt') ? 'com.microsoft.minecraft.wsencrypt' : false;
    }
});
const key = await new Promise((resolve, reject) => {
    crypto.generateKeyPair('ec', {
        namedCurve: 'P-384',
        publicKeyEncoding: {
            type: 'spki',
            format: 'der'
        },
    }, (err, publicKey, privateKey) => {
        if (err) {
            reject(err);
        } else {
            resolve({ publicKey, privateKey });
        }
    })
});
const salt = crypto.randomBytes(16);

console.log(`Server started on port ${ port }`);

function sendAllRenderers(channel, data) {
    BrowserWindow.getAllWindows().forEach((window) => window.webContents.send(channel, data));
}

wss.on('connection', async (ws) => {
    if (wss.clients.size > 1) ws.close();

    sendAllRenderers('connection');

    function initPlayer() {
        ws.send(JSON.stringify(buildSubscription('PlayerDied', crypto.randomUUID())));
        ws.send(JSON.stringify(buildSubscription('ItemUsed', crypto.randomUUID())));
        ws.send(JSON.stringify(buildSubscription('PlayerMessage', crypto.randomUUID())));
    }

    const encryptId = crypto.randomUUID();

    ws.on('message', (message) => {
        console.log(message.toString());
        try {
            const data = JSON.parse(message);

            if (data?.header?.messagePurpose === 'commandResponse' && data?.header?.requestId in commandRequests) {
                commandRequests[data?.header?.requestId](data?.body);

                delete commandRequests[data?.header?.requestId];
            } else if (data?.header?.messagePurpose === 'event') {
                sendAllRenderers(`event:${ data?.header?.eventName }`, data?.body);
            } else if (data?.header?.messagePurpose === 'ws:encrypt') {
                Buffer.from(data?.body?.publicKey, 'base64')
            }
        } catch (err) {
            if (err instanceof SyntaxError) console.warn('Ignoring message with invalid syntax.', message);

            console.error('Unknown error occurred handling a message.', err);
        }
    });

    ws.send(JSON.stringify(buildCommandRequest(`enableencryption "${ Buffer.from(key.publicKey).toString('base64') }" "${ salt.toString('base64') }"`, encryptId)));
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
        wss.clients.forEach((ws) => {
            ws.send(JSON.stringify(buildCommandRequest(command, crypto.randomUUID())));
        });
    });

    ipcMain.handle('command-with-response', (event, command) => {
        return new Promise((resolve, reject) => {
            wss.clients.forEach((ws) => {
                const id = crypto.randomUUID();

                commandRequests[id] = (result) => resolve(result);

                ws.send(JSON.stringify(buildCommandRequest(command, id)));
            });
        });
    });

    // same as above but synchronously
    ipcMain.on('command-with-response', async (event, command) => {
        event.returnValue = await new Promise((resolve, reject) => {
            wss.clients.forEach((ws) => {
                const id = crypto.randomUUID();

                commandRequests[id] = (result) => resolve(result);

                ws.send(JSON.stringify(buildCommandRequest(command, id)));
            });
        });
    });

    ipcMain.handle('request-port', (event) => port);
});