import { getRandomInterval } from './utils.js';

export let hydration = { value: 100 }; // Export hydration as an object
let energy = 100;
let activity = 100;
let focus = 0;

export function initializeStats() {
  const hydrationDecayRate = 50; // Hydration decreases by 50 every minute
  const hydrationDecayInterval = 60 * 1000; // 1 minute in milliseconds
  const notificationCooldownInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
  let lastNotificationTime = 0; // Initialize to 0 to allow immediate first notification

  setInterval(() => {
    hydration.value = Math.max(0, hydration.value - hydrationDecayRate); // Gradual hydration decay
    energy = Math.max(0, energy - 1); // Decrease energy
    activity = Math.max(0, activity - 1); // Decrease activity
    updateStatsDisplay();

    console.log(`Hydration: ${hydration.value}, Last Notification Time: ${lastNotificationTime}`);

    const currentTime = Date.now();
    if (hydration.value <= 50 && currentTime - lastNotificationTime >= notificationCooldownInterval) {
      console.log('Hydration is low. Triggering hydration notification.');
      try {
        window.electronAPI.showWaterReminder(); // Show water reminder
        console.log('Notification triggered successfully.');
      } catch (error) {
        console.error('Error triggering notification:', error);
      }

      lastNotificationTime = currentTime; // Update the last notification time
    }
  }, hydrationDecayInterval); // Decay hydration every minute
}

export function updateStatsDisplay() {
  document.getElementById('hydrationStatus').textContent = `Hydration: ${hydration.value}`;
  document.getElementById('energyStatus').textContent = `Energy: ${energy}`;
  document.getElementById('activityStatus').textContent = `Activity: ${activity}`;
  document.getElementById('focusStatus').textContent = `Focus: ${focus}`;
}