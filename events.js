import { hydration, updateStatsDisplay } from './stats.js'; // Import hydration

export function initializeEvents(pikmin, resetAnimationState, animate, getCurrentHat) {
  document.addEventListener('mousemove', (event) => {
    const pikminRect = pikmin.getBoundingClientRect();
    const isMouseOverPikmin =
      event.clientX >= pikminRect.left &&
      event.clientX <= pikminRect.right &&
      event.clientY >= pikminRect.top &&
      event.clientY <= pikminRect.bottom;

    window.electronAPI.toggleMouseEvents(!isMouseOverPikmin);
  });

  document.getElementById('waterPikmin').addEventListener('click', () => {
    hydration.value = Math.min(100, hydration.value + 20); // Use hydration.value
    updateStatsDisplay();
    console.log('Water Pikmin button clicked');

    // Get the current hat dynamically
    const currentHat = getCurrentHat();

    // Play watering GIF
    const wateringGifPath = window.electronAPI.resolveAssetPath(`sprites/yellow/water/${currentHat}.gif`);
    pikmin.style.backgroundImage = `url("${wateringGifPath}")`;

    // Play drink.mp3 sound
    const drinkAudioPath = window.electronAPI.resolveAssetPath('sounds/drink.mp3');
    const drinkAudio = new Audio(drinkAudioPath);
    drinkAudio.play().catch((error) => {
      console.error('Error playing drink.mp3:', error);
    });

    // Delay updating the walking animation until after the watering animation completes
    setTimeout(() => {
      // Update walking animation only after the hat is upgraded
      const walkingPath = window.electronAPI.resolveAssetPath(`sprites/yellow/walking/${currentHat}/right.png`);
      pikmin.style.backgroundImage = `url("${walkingPath}")`;
      console.log('Reset to walking animation with current hat:', currentHat);
    }, 3000); // 3 seconds for watering animation duration
  });

  document.getElementById('napTogether').addEventListener('click', () => {
    energy = Math.min(100, energy + 30);
    updateStatsDisplay();
    console.log('Nap Together button clicked');
  });

  document.getElementById('stretchTime').addEventListener('click', () => {
    activity = Math.min(100, activity + 20);
    updateStatsDisplay();
    console.log('Stretch Time button clicked');
  });

  document.getElementById('startFocus').addEventListener('click', () => {
    focus += 1;
    updateStatsDisplay();
    console.log('Start Focus button clicked');
  });
}
