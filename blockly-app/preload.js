const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('minecraft', {
    runCommand: (command) => ipcRenderer.send('command', command)
});