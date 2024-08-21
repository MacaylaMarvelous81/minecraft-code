const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('system', {
    saveFileUser: (data) => ipcRenderer.invoke('save-file-user', data),
    loadFileUser: () => ipcRenderer.invoke('load-file-user')
});

contextBridge.exposeInMainWorld('wsserver', {
    getPort: () => ipcRenderer.invoke('request-port'),
    onConnection: (callback) => ipcRenderer.on('connection', (event) => callback())
});

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
    onItemUsed: (callback) => ipcRenderer.on('event:ItemUsed', (event, value) => callback(value)),
    onPlayerMessage: (callback) => ipcRenderer.on('event:PlayerMessage', (event, value) => callback(value))
});