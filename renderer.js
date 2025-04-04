import { initializeStats } from './stats.js';
import { initializeEvents } from './events.js';
import { getRandomInterval } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!window.electronAPI) {
    console.error('electronAPI is undefined. Preload script may have failed to load.');
    alert('Error: Preload script failed to load. Please check the console for details.');
    return;
  }

  const pikmin = document.getElementById('pikmin');
  const frameWidth = 24;
  const frameHeight = 50;
  const totalFrames = 4;
  let currentFrame = 0;
  let position = 0;
  let direction = 'right';
  let isIdle = false;
  let animationFrameId;
  let hydration = 100;
  let energy = 100;
  let activity = 100;
  let focus = 0;
  let currentHat = 'leaf'; // Default hat

  // Dynamically resolve the initial background image path
  const initialPath = window.electronAPI.resolveAssetPath('sprites/yellow/walking/leaf/right.png');
  console.log('Resolved Initial Path:', initialPath); // Debug log

  // Test loading the image
  const img = new Image();
  img.src = initialPath;
  img.onload = () => {
    console.log('Image loaded successfully:', initialPath);
    pikmin.style.backgroundImage = `url("${initialPath}")`;
  };
  img.onerror = (err) => {
    console.error('Failed to load image:', initialPath, err);
  };

  function animate() {
    if (isIdle) return; // Prevent animation during idle state

    // Handle walking state animation
    currentFrame = (currentFrame + 1) % totalFrames;
    pikmin.style.backgroundPosition = `-${currentFrame * frameWidth}px 0`;

    if (direction === 'right') {
      position += 2;
      if (position >= window.innerWidth) {
        direction = 'left';
        const leftPath = window.electronAPI.resolveAssetPath(`sprites/yellow/walking/${currentHat}/left.png`);
        pikmin.style.backgroundImage = `url("${leftPath}")`;
      }
    } else {
      position -= 2;
      if (position <= -frameWidth) {
        direction = 'right';
        const rightPath = window.electronAPI.resolveAssetPath(`sprites/yellow/walking/${currentHat}/right.png`);
        pikmin.style.backgroundImage = `url("${rightPath}")`;
      }
    }
    pikmin.style.left = `${position}px`;

    animationFrameId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 150);
  }

  function resetAnimationState() {
    clearTimeout(animationFrameId);
    cancelAnimationFrame(animationFrameId);
    currentFrame = 0;
    console.log('Animation state reset');
  }

  function updateStatusDisplay() {
    document.getElementById('hydrationStatus').textContent = `Hydration: ${hydration}`;
    document.getElementById('energyStatus').textContent = `Energy: ${energy}`;
    document.getElementById('activityStatus').textContent = `Activity: ${activity}`;
    document.getElementById('focusStatus').textContent = `Focus: ${focus}`;
  }

  function updateHappiness() {
    const happiness = (hydration > 60 && energy > 60 && activity > 60) ? 'happy' : 'sad';
    updateStatusDisplay();
    console.log(`Happiness updated to: ${happiness}`);
  }

  // Hydration refill
  function waterPikmin() {
    hydration = Math.min(100, hydration + 20);
    window.electronAPI.waterPikmin();

    const drinkAudioPath = window.electronAPI.resolveAssetPath('sounds/drink.mp3');
    const drinkAudio = new Audio(drinkAudioPath);
    drinkAudio.play().catch(error => {
      console.error('Error playing drink sound:', error);
    });

    isIdle = true;
    resetAnimationState();

    const waterAnimationPath = window.electronAPI.resolveAssetPath(`sprites/yellow/water/${currentHat}.gif`);
    console.log('Resolved Water Animation Path:', waterAnimationPath); // Debug log
    pikmin.style.backgroundImage = `url("${waterAnimationPath}")`;

    // Determine the next hat stage
    let nextHat = currentHat;
    if (currentHat === 'leaf') {
      nextHat = 'bud';
    } else if (currentHat === 'bud') {
      nextHat = 'flower';
    }

    // Delay updating the walking animation until after the water animation completes
    setTimeout(() => {
      // Update the current hat only after the water animation completes
      if (nextHat !== currentHat) {
        const upgradeAudioPath = window.electronAPI.resolveAssetPath('sounds/upgrade.mp3');
        const upgradeAudio = new Audio(upgradeAudioPath);
        upgradeAudio.play().catch(error => {
          console.error('Error playing upgrade sound:', error);
        });

        currentHat = nextHat; // Update the hat only after playing the sound
      }

      // Update walking animation only after the hat is upgraded
      const walkingAnimationPath = window.electronAPI.resolveAssetPath(`sprites/yellow/walking/${currentHat}/right.png`);
      pikmin.style.backgroundImage = `url("${walkingAnimationPath}")`;

      isIdle = false;
      direction = 'right';

      animate();
      updateHappiness();
    }, 3800); // 3.8 seconds for water animation duration
  }

  // Energy refill
  function napTogether() {
    energy = Math.min(100, energy + 30);
    updateHappiness();
    setTimeout(() => {
      console.log('Nap complete!');
    }, 300000); // 5 minutes
  }

  // Activity refill
  function stretchTime() {
    activity = Math.min(100, activity + 20);
    updateHappiness();
  }

  // Focus reward
  function startFocus() {
    focus += 1;
    const focusPath = window.electronAPI.resolveAssetPath(`sprites/yellow/focus/${currentHat}.png`);
    pikmin.style.backgroundImage = `url("${focusPath}")`;
    setTimeout(() => {
      updateHappiness();
    }, 1500);
  }

  function startIdle(duration = 30000) { // Default duration is 30 seconds
    if (isIdle) return; // Prevent multiple idle animations
    isIdle = true;
    resetAnimationState(); // Ensure no overlapping animations
    let idleFrame = 0;

    function playIdleFrame() {
      if (!isIdle) return;

      pikmin.style.backgroundPosition = `-${idleFrame * frameWidth}px 0`;
      idleFrame = (idleFrame + 1) % totalFrames;

      // Use the randomized interval for idle animation
      const randomDelay = getRandomInterval(200, 800); // Random delay between 200ms and 800ms
      setTimeout(playIdleFrame, randomDelay);
    }

    // Use the idle sprite sheet for the current hat
    const idlePath = window.electronAPI.resolveAssetPath(`sprites/yellow/idle/${currentHat}.png`);
    console.log('Resolved Idle Path:', idlePath); // Debug log
    pikmin.style.backgroundImage = `url("${idlePath}")`;

    playIdleFrame();

    // Exit idle state after the specified duration
    setTimeout(() => {
      isIdle = false;
      const walkingPath = window.electronAPI.resolveAssetPath(`sprites/yellow/walking/${currentHat}/right.png`);
      console.log('Resolved Walking Path:', walkingPath); // Debug log
      pikmin.style.backgroundImage = `url("${walkingPath}")`;
      resetAnimationState();
      animate(); // Resume walking animation
    }, duration);
  }

  // Attach event listeners to sidebar buttons
  const waterButton = document.getElementById('waterPikmin');
  if (waterButton) {
    waterButton.addEventListener('click', waterPikmin);
  }

  const napButton = document.getElementById('napTogether');
  if (napButton) {
    napButton.addEventListener('click', napTogether);
  }

  const stretchButton = document.getElementById('stretchTime');
  if (stretchButton) {
    stretchButton.addEventListener('click', stretchTime);
  }

  const focusButton = document.getElementById('startFocus');
  if (focusButton) {
    focusButton.addEventListener('click', startFocus);
  }

  // Add click event to trigger idle animation and play on_click.mp3
  pikmin.addEventListener('click', () => {
    console.log('Pikmin clicked! Triggering idle animation.');

    // Trigger idle animation for 1 second
    startIdle(1000);

    // Play on_click.mp3 sound
    const clickAudioPath = window.electronAPI.resolveAssetPath('sounds/on_click.mp3'); // Ensure correct path
    console.log('Resolved Click Audio Path:', clickAudioPath); // Debug log
    const clickAudio = new Audio(clickAudioPath);
    clickAudio.play().catch((error) => {
      console.error('Error playing on_click.mp3:', error);
    });
  });

  // Initialize stats and events
  initializeStats();
  initializeEvents(pikmin, resetAnimationState, animate, () => currentHat); // Pass currentHat as a getter function

  // Start the animation
  animate();

  // Example: Start idle state every 10 seconds for testing
  setInterval(startIdle, 10000);

  // Listen for the trigger-idle-animation event
  window.electronAPI.triggerIdleAnimation(() => {
    console.log('Idle animation triggered by low hydration.');
    startIdle(2000); // Idle for 2 seconds when hydration is low
  });
});