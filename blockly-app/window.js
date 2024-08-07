const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600
    });

    window.loadFile(path.resolve(__dirname, 'wwwdist/index.html'));
}

function startApp() {
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

module.exports = {
    startApp
};