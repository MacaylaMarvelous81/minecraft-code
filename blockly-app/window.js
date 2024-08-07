import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'node:path';
import { sendQueue } from '../server/server.js';
import crypto from 'node:crypto';

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

export function startApp() {
    app.whenReady().then(() => {
        createWindow();
    
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });

        ipcMain.on('command', (event, command) => {
            sendQueue.push(JSON.stringify({
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
        });
    });
    
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
}