const { BrowserWindow, ipcMain, screen } = require('electron');

let reminderWindow = null;

function createReminderWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  reminderWindow = new BrowserWindow({
    width: 300,
    height: 100, // Compact design
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    x: width - 320, // 20px from the right edge
    y: 20, // 20px from the top edge
    webPreferences: {
      contextIsolation: true,
    },
  });

  reminderWindow.loadURL(`data:text/html;charset=utf-8,
    <html>
      <head>
        <title>Reminder</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            cursor: pointer;
          }
          h1 {
            font-size: 16px;
            color: #333;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <h1>💧 Time to drink water! 💧</h1>
      </body>
    </html>`);

  // Close the window after 5 seconds if not interacted with
  const autoCloseTimeout = setTimeout(() => {
    if (reminderWindow) {
      reminderWindow.close();
      reminderWindow = null;
    }
  }, 5000);

  // Close the window on click and swipe right
  reminderWindow.webContents.once('did-finish-load', () => {
    reminderWindow.webContents.executeJavaScript(`
      document.body.addEventListener('click', () => {
        window.close();
      });
    `);
  });

  reminderWindow.on('closed', () => {
    clearTimeout(autoCloseTimeout);
    reminderWindow = null;
  });
}

// Listen for the "show-water-reminder" event
ipcMain.on('show-water-reminder', () => {
  if (!reminderWindow) {
    createReminderWindow();
  }
});

// Close the reminder window when the user waters the Pikmin
ipcMain.on('water-pikmin', () => {
  if (reminderWindow) {
    reminderWindow.close();
    reminderWindow = null;
  }
});

module.exports = { createReminderWindow };
