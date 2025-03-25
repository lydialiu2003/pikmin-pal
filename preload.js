const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  toggleMouseEvents: (ignoreMouseEvents) => ipcRenderer.send('toggle-mouse-events', ignoreMouseEvents),
  forwardClick: (mouseX, mouseY) => ipcRenderer.send('forward-click', mouseX, mouseY),
  changeHat: (hat) => ipcRenderer.send('change-hat', hat),
  onHatChange: (callback) => ipcRenderer.on('hat-changed', (_, hat) => callback(hat)),
});

window.addEventListener('DOMContentLoaded', () => {
  // Preload script content
});
