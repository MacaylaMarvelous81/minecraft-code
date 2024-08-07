import { app, BrowserWindow } from 'electron';
import path from 'node:path';

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600
    });

    window.loadFile(path.resolve(import.meta.dirname, 'wwwdist/index.html'));
}

export function startApp() {
    app.whenReady().then(() => {
        createWindow();
    
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });
    
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
}