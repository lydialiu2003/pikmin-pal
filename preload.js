const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  enableMouseEvents: () => ipcRenderer.send('enable-mouse-events'),
  disableMouseEvents: () => ipcRenderer.send('disable-mouse-events'),
  toggleMouseEvents: (ignoreMouseEvents) => ipcRenderer.send('toggle-mouse-events', ignoreMouseEvents),
  forwardClick: (mouseX, mouseY) => ipcRenderer.send('forward-click', mouseX, mouseY),
  changeHat: (hat) => ipcRenderer.send('change-hat', hat),
  onHatChange: (callback) => ipcRenderer.on('hat-changed', (_, hat) => callback(hat)),
  sidebarHover: (isHovered) => ipcRenderer.send('sidebar-hover', isHovered),
  getBasePath: () => __dirname,
  showWaterReminder: () => ipcRenderer.send('show-water-reminder'),
  waterPikmin: () => ipcRenderer.send('water-pikmin'),
});

window.addEventListener('DOMContentLoaded', () => {
  // Preload script content
});
