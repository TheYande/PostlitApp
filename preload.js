const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  minimize: () => ipcRenderer.send('minimize-window'),
  toggleMaximize: () => ipcRenderer.send('toggle-maximize-window'),
  close: () => ipcRenderer.send('close-window')
});
