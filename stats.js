import { getRandomInterval } from './utils.js';

export let hydration = { value: 100 }; // Export hydration as an object
let energy = 100;
let activity = 100;
let focus = 0;
let isHeyPlaying = false; // Track if hey.mp3 is already playing
let hydrationNotificationCooldown = false; // Cooldown flag to prevent rapid re-triggering

export function initializeStats() {
  setInterval(() => {
    hydration.value = Math.max(0, hydration.value - getRandomInterval(10, 20)); // Decrease hydration
    energy = Math.max(0, energy - 1); // Decrease energy
    activity = Math.max(0, activity - 1); // Decrease activity
    updateStatsDisplay();

    if (hydration.value < 50 && !isHeyPlaying && !hydrationNotificationCooldown) {
      console.log('Hydration is low. Triggering hydration notification.');
      console.log('Playing hey.mp3. Setting isHeyPlaying to true and activating cooldown.');
      window.electronAPI.showWaterReminder(); // Show water reminder

      isHeyPlaying = true;
      hydrationNotificationCooldown = true; // Activate cooldown
      const heyAudioPath = window.electronAPI.resolveAssetPath('sounds/hey.mp3');
      const heyAudio = new Audio(heyAudioPath);
      heyAudio.play().catch((error) => {
        console.error('Error playing hey.mp3:', error);
      });

      heyAudio.onended = () => {
        console.log('hey.mp3 playback ended. Resetting isHeyPlaying to false.');
        isHeyPlaying = false; // Reset flag when audio ends
      };

      // Reset cooldown after 10 seconds
      setTimeout(() => {
        hydrationNotificationCooldown = false;
        console.log('Hydration notification cooldown reset.');
      }, 10000);
    }
  }, 5000);
}

export function updateStatsDisplay() {
  document.getElementById('hydrationStatus').textContent = `Hydration: ${hydration.value}`;
  document.getElementById('energyStatus').textContent = `Energy: ${energy}`;
  document.getElementById('activityStatus').textContent = `Activity: ${activity}`;
  document.getElementById('focusStatus').textContent = `Focus: ${focus}`;
}