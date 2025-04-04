const { ipcMain, Notification } = require('electron');

function showNativeNotification() {
  const notification = new Notification({
    title: 'Hydration Reminder',
    body: '💧 Time to drink water!',
    silent: false, // Play sound
  });

  notification.show();

  notification.on('click', () => {
    console.log('Notification clicked!');
  });
}

// Listen for the "show-water-reminder" event
ipcMain.on('show-water-reminder', () => {
  console.log('Triggering Electron notification...');
  showNativeNotification();
});

module.exports = { showNativeNotification };