const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('minecraft', {
    runCommand: (command) => ipcRenderer.send('command', command),
    runCommandWithResponse: (command) => ipcRenderer.sendSync('command-with-response', command),
    resetEventListeners: () => {
        ipcRenderer.eventNames().forEach((name) => {
            if (name.substring(0, 6) === 'event:') {
                ipcRenderer.listeners(name).forEach(listener => ipcRenderer.removeListener(name, listener));
            }
        });
    },
    onPlayerDied: (callback) => ipcRenderer.on('event:PlayerDied', (event, value) => callback(value)),
    onItemUsed: (callback) => ipcRenderer.on('event:ItemUsed', (event, value) => callback(value))
});