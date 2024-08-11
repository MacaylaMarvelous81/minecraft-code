const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('minecraft', {
    runCommand: (command) => ipcRenderer.send('command', command),
    runCommandWithResponse: (command) => ipcRenderer.sendSync('command-with-response', command),
    onPlayerDied: (callback) => ipcRenderer.on('event:PlayerDied', (event, value) => callback(value))
});