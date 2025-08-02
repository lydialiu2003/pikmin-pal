const { Notification } = require('electron');

function showNativeNotification() {
  try {
    const notification = new Notification({
      title: 'Hydration Reminder',
      body: '💧 Time to drink water!',
    });

    notification.show();
    console.log('Native notification displayed.');
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

module.exports = { showNativeNotification };