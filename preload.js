const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  toggleMouseEvents: (ignoreMouseEvents) => ipcRenderer.send('toggle-mouse-events', ignoreMouseEvents),
  forwardClick: (mouseX, mouseY) => ipcRenderer.send('forward-click', mouseX, mouseY),
});

window.addEventListener('DOMContentLoaded', () => {
  // Preload script content
});
