const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

// Retrieve the userData path from the command-line arguments
const userDataPath = process.argv.find(arg => arg.startsWith('--userDataPath='))?.split('=')[1];

contextBridge.exposeInMainWorld('electronAPI', {
  enableMouseEvents: () => ipcRenderer.send('enable-mouse-events'),
  disableMouseEvents: () => ipcRenderer.send('disable-mouse-events'),
  toggleMouseEvents: (ignoreMouseEvents) => ipcRenderer.send('toggle-mouse-events', ignoreMouseEvents),
  forwardClick: (mouseX, mouseY) => ipcRenderer.send('forward-click', mouseX, mouseY),
  changeHat: (hat) => ipcRenderer.send('change-hat', hat),
  onHatChange: (callback) => ipcRenderer.on('hat-changed', (_, hat) => callback(hat)),
  sidebarHover: (isHovered) => ipcRenderer.send('sidebar-hover', isHovered),
  getBasePath: () => {
    // Use `process.cwd()` for development and `process.resourcesPath` for production
    return process.env.NODE_ENV === 'development' ? process.cwd() : process.resourcesPath;
  },
  getUserDataPath: () => userDataPath, // Expose the userData path to the renderer process
  showWaterReminder: () => {
    console.log('Calling showWaterReminder from preload.js');
    ipcRenderer.send('show-water-reminder');
  },
  waterPikmin: () => ipcRenderer.send('water-pikmin'),
  resolveAssetPath: (relativePath) => {
    const basePath = path.join(userDataPath, 'assets'); // Always resolve from userData/assets
    const resolvedPath = path.join(basePath, relativePath);
    const fileUrl = encodeURI(`file://${resolvedPath.replace(/\\/g, '/')}`); // Use encodeURI for file URLs

    console.log(`Resolving asset path: ${relativePath}`);
    console.log(`Base Path: ${basePath}`);
    console.log(`Resolved Path: ${resolvedPath}`);
    console.log(`File URL: ${fileUrl}`);

    if (!fs.existsSync(resolvedPath)) {
      console.error(`Asset not found: ${resolvedPath}`);
    }

    return fileUrl;
  },
  
  resolveWateringGif: (currentHat) => {
    const relativePath = `sprites/yellow/water/${currentHat}.gif`;
    return window.electronAPI.resolveAssetPath(relativePath); // Reuse resolveAssetPath for consistency
  },
  listAssets: () => {
    const basePath = path.join(userDataPath, 'assets');
    try {
      const files = fs.readdirSync(basePath, { withFileTypes: true });
      console.log('Assets in base path:', basePath);
      files.forEach((file) => {
        console.log(file.isDirectory() ? `[DIR] ${file.name}` : `[FILE] ${file.name}`);
      });
    } catch (error) {
      console.error('Error reading assets directory:', error);
    }
  },
  triggerIdleAnimation: () => ipcRenderer.send('trigger-idle-animation'), // Expose idle animation trigger
});

console.log('process.resourcesPath:', process.resourcesPath);
console.log('Base Path:', process.env.NODE_ENV === 'development'
  ? path.resolve(__dirname, 'assets')
  : path.join(userDataPath, 'assets'));
console.log('process.cwd():', process.cwd());
console.log('__dirname:', __dirname);