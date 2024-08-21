import getPort, { portNumbers } from 'get-port';
import { WebSocketServer } from 'ws';
import { BrowserWindow, app, ipcMain, dialog } from 'electron';
import path from 'node:path'
import { Client } from './websocket/client.js';
import fs from 'node:fs/promises';

const port = await getPort({
    port: portNumbers(49152, 65535)
});
const wss = new WebSocketServer({
    port,
    handleProtocols: (protocols, req) => {
        return protocols.has('com.microsoft.minecraft.wsencrypt') ? 'com.microsoft.minecraft.wsencrypt' : false;
    }
});

console.log(`Server started on port ${ port }`);

function sendAllRenderers(channel, data) {
    BrowserWindow.getAllWindows().forEach((window) => window.webContents.send(channel, data));
}

wss.on('connection', async (ws) => {
    if (wss.clients.size > 1) ws.close();

    sendAllRenderers('connection');

    const client = new Client(ws);

    await client.enableEncryption();

    client.onGameEvent((name, body) => sendAllRenderers(`event:${ name }`, body));

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

    ipcMain.handle('save-file-user', async (event, data) => {
        // Maybe have options provided by renderer so this is generic if necessary.
        const result = await dialog.showSaveDialog(window, {
            title: 'Save To',
            filters: [
                {
                    name: 'JSON File',
                    extensions: [ 'json' ]
                }
            ]
        });

        if (result.canceled) return;

        await fs.writeFile(result.filePath, data, {
            encoding: 'utf8'
        });
    });

    ipcMain.handle('load-file-user', async (event) => {
        const result = await dialog.showOpenDialog(window, {
            title: 'Open From',
            filters: [
                {
                    name: 'JSON File',
                    extensions: [ 'json' ]
                }
            ],
            properties: [ 'openFile' ]
        });

        const path = result.filePaths[0];

        // This should never happen because the multiSelections property is not set.
        if (result.filePaths.length > 1) console.warn('Multiple files selected?! This is unexpected behavior.');

        return await fs.readFile(path, {
            encoding: 'utf8'
        });
    });
});