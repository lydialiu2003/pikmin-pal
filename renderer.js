document.addEventListener('DOMContentLoaded', () => {
  const pikmin = document.getElementById('pikmin');
  const frameWidth = 24;
  const frameHeight = 50;
  const totalFrames = 4; // Assuming there are 4 frames in the sprite sheet
  const idleFrames = 5; // Assuming there are 5 frames in the idle sprite sheet
  let currentFrame = 0;
  let position = 0;
  let direction = 'right';
  let isIdle = false;
  let idleFrameTimeout;
  let mouseX = 0;
  let mouseY = 0;
  let currentHat = 'leaf'; // Default hat
  let frameSpeed = 150; // Default speed for bud
  const movementPerFrame = 2; // Fixed amount of movement per frame
  let animationFrameId; // Store the current animation frame ID for proper synchronization

  // Core stats
  let hydration = 100;
  let energy = 100;
  let activity = 100;
  let focus = 0;

  pikmin.style.backgroundImage = `url('./assets/sprites/yellow/walking/${currentHat}/${direction}.png')`;

  function animate() {
    // Ensure the animation cycles through the walking frames
    currentFrame = (currentFrame + 1) % totalFrames;
    pikmin.style.backgroundPosition = `-${currentFrame * frameWidth}px 0`;

    if (!isIdle) {
      // Move Pikmin horizontally by a fixed amount per frame
      if (direction === 'right') {
        position += movementPerFrame;
        if (position >= window.innerWidth) {
          direction = 'left';
          pikmin.style.backgroundImage = `url('./assets/sprites/yellow/walking/${currentHat}/left.png')`;
        }
      } else {
        position -= movementPerFrame;
        if (position <= -frameWidth) {
          direction = 'right';
          pikmin.style.backgroundImage = `url('./assets/sprites/yellow/walking/${currentHat}/right.png')`;
        }
      }
      pikmin.style.left = `${position}px`;
    }

    // Continue animation with the current frame speed (walking only)
    animationFrameId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, frameSpeed);
  }

  function resetAnimationState() {
    // Clear any ongoing or pending animations
    clearTimeout(animationFrameId);
    cancelAnimationFrame(animationFrameId);
    clearTimeout(idleFrameTimeout); // Clear idle frame timeout
    currentFrame = 0; // Reset to the first frame

    console.log('Animation state reset'); // Debug log
  }

  function switchDirection() {
    if (isIdle) return;

    if (Math.random() < 0.3) { // 30% chance to switch direction
      direction = direction === 'right' ? 'left' : 'right';
      pikmin.style.backgroundImage = direction === 'right' 
        ? `url('./assets/sprites/yellow/walking/${currentHat}/right.png')` 
        : `url('./assets/sprites/yellow/walking/${currentHat}/left.png')`;
    }
  }

  function startIdle() {
    if (isIdle) return; // Prevent multiple idle animations
    isIdle = true;
    resetAnimationState(); // Ensure no overlapping animations
    let idleFrame = 0;

    function playIdleFrame() {
      if (!isIdle) return;

      pikmin.style.backgroundPosition = `-${idleFrame * frameWidth}px 0`;
      idleFrame = (idleFrame + 1) % idleFrames;

      // Use the randomized interval for idle animation
      idleFrameTimeout = setTimeout(playIdleFrame, getRandomInterval(200, 800));
    }

    // Use the currentHat for the idle animation
    pikmin.style.backgroundImage = `url('./assets/sprites/yellow/idle/${currentHat}.png')`;
    playIdleFrame();

    setTimeout(() => {
      isIdle = false;
      pikmin.style.backgroundImage = direction === 'right' 
        ? `url('./assets/sprites/yellow/walking/${currentHat}/right.png')` 
        : `url('./assets/sprites/yellow/walking/${currentHat}/left.png')`;
      resetAnimationState();
      animate(); // Resume walking animation
    }, 30000); // Idle for 30 seconds
  }

  function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function handleClick(event) {
    const pikminRect = pikmin.getBoundingClientRect();

    // Check if the mouse click is within Pikmin's bounding box
    if (
      event.clientX >= pikminRect.left &&
      event.clientX <= pikminRect.right &&
      event.clientY >= pikminRect.top &&
      event.clientY <= pikminRect.bottom
    ) {
      isIdle = true; // Set idle state to stop movement
      resetAnimationState(); // Ensure no overlapping animations
      let idleFrame = 0;

      function playIdleFrame() {
        if (!isIdle) return;

        pikmin.style.backgroundPosition = `-${idleFrame * frameWidth}px 0`;
        idleFrame = (idleFrame + 1) % idleFrames;

        // Use the randomized interval for idle animation
        idleFrameTimeout = setTimeout(playIdleFrame, getRandomInterval(500, 1100));
      }

      // Use the currentHat for the idle animation
      pikmin.style.backgroundImage = `url('./assets/sprites/yellow/idle/${currentHat}.png')`;
      playIdleFrame();

      const audio = new Audio('./assets/sounds/on_click.mp3');
      audio.play().catch(error => {
        console.error('Error playing sound:', error);
      });

      setTimeout(() => {
        isIdle = false; // Reset the idle state to allow further clicks
        pikmin.style.backgroundImage = direction === 'right' 
          ? `url('./assets/sprites/yellow/walking/${currentHat}/right.png')` 
          : `url('./assets/sprites/yellow/walking/${currentHat}/left.png')`;
        resetAnimationState();
        animate(); // Resume walking animation
      }, 1000); // Idle for 1 second
    }
  }

  function toggleMouseEvents(event) {
    const pikminRect = pikmin.getBoundingClientRect();

    // Check if the mouse is over the Pikmin
    const isMouseOverPikmin =
      event.clientX >= pikminRect.left &&
      event.clientX <= pikminRect.right &&
      event.clientY >= pikminRect.top &&
      event.clientY <= pikminRect.bottom;

    // Toggle mouse events based on whether the mouse is over the Pikmin
    window.electronAPI.toggleMouseEvents(!isMouseOverPikmin);
  }

  function updateHat(newHat) {
    currentHat = newHat;

    // Play the "upgrade.mp3" sound
    const upgradeAudio = new Audio('./assets/sounds/upgrade.mp3');
    upgradeAudio.play().then(() => {
      console.log('Upgrade sound played successfully');
    }).catch(error => {
      console.error('Error playing upgrade sound:', error);
    });

    // Update frame speed based on the selected hat (walking only)
    if (currentHat === 'leaf') {
      frameSpeed = 200;
    } else if (currentHat === 'bud') {
      frameSpeed = 150;
    } else if (currentHat === 'flower') {
      frameSpeed = 100;
    }

    // Construct absolute paths for idle and walking animations with cache-busting
    const idlePath = `file://${__dirname}/assets/sprites/yellow/idle/${currentHat}.png?v=${Date.now()}`;
    const walkingPath = `file://${__dirname}/assets/sprites/yellow/walking/${currentHat}/${direction}.png?v=${Date.now()}`;

    // Debug log to confirm the file paths
    console.log(`Updated hat to ${currentHat}. Idle path: ${idlePath}, Walking path: ${walkingPath}`);

    // Update the background image only if the file path changes
    if (isIdle) {
      pikmin.style.backgroundImage = `url("${idlePath}")`;
    } else {
      pikmin.style.backgroundImage = `url("${walkingPath}")`;
    }

    // Reset animation state to ensure proper sequencing
    resetAnimationState();
    if (!isIdle) {
      animate(); // Restart the walking animation
    }
  }

  window.electronAPI.onHatChange((newHat) => {
    updateHat(newHat);
  });

  // Track mouse position globally
  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  // Add a global click listener to check for clicks within Pikmin's area
  document.addEventListener('click', handleClick);

  // Add a global mousemove listener to dynamically enable or disable mouse events
  document.addEventListener('mousemove', (event) => {
    const element = document.elementFromPoint(event.clientX, event.clientY);

    if (element && (element.id === 'pikmin' || element.closest('#sidebar'))) {
      window.electronAPI.enableMouseEvents(); // Allow interaction
    } else {
      window.electronAPI.disableMouseEvents(); // Ignore mouse events
    }
  });

  // Ensure mouse events are enabled for the sidebar
  const sidebar = document.getElementById('sidebar');
  sidebar.addEventListener('mouseenter', () => {
    console.log('Sidebar hovered'); // Debug log
    window.electronAPI.sidebarHover(true); // Notify main process to enable mouse events
  });
  sidebar.addEventListener('mouseleave', () => {
    console.log('Sidebar unhovered'); // Debug log
    window.electronAPI.sidebarHover(false); // Notify main process to disable mouse events
  });

  // Start the Pikmin walking immediately
  animate();

  setInterval(switchDirection, 10000); // Check every 10 seconds
  setInterval(startIdle, 60000); // Check every 1 minute

  window.electronAPI.forwardClick = (mouseX, mouseY) => {
    handleClick({ clientX: mouseX, clientY: mouseY });
  };

  const hydrationStatus = document.getElementById('hydrationStatus');
  const energyStatus = document.getElementById('energyStatus');
  const activityStatus = document.getElementById('activityStatus');
  const focusStatus = document.getElementById('focusStatus');

  function updateStatusDisplay() {
    hydrationStatus.textContent = `Hydration: ${hydration}`;
    energyStatus.textContent = `Energy: ${energy}`;
    activityStatus.textContent = `Activity: ${activity}`;
    focusStatus.textContent = `Focus: ${focus}`;
  }

  // Update Pikmin's happiness based on core stats
  function updateHappiness() {
    const happiness = (hydration > 60 && energy > 60 && activity > 60) ? 'happy' : 'sad';

    // Update the status display only, without changing the animation
    updateStatusDisplay();

    console.log(`Happiness updated to: ${happiness}`); // Debug log
  }

  // Decay stats over time
  setInterval(() => {
    hydration = Math.max(0, hydration - getRandomInterval(10, 20)); // Faster decay for testing
    energy = Math.max(0, energy - 1); // Decay every 10 mins
    activity = Math.max(0, activity - 1); // Decay every 30 mins

    // Trigger water reminder if hydration is below 100 (higher threshold for testing)
    if (hydration < 100) {
      triggerAlert();
    }

    updateHappiness();
  }, 5000); // Check every 5 seconds for testing

  // Hydration refill
  function waterPikmin() {
    hydration = Math.min(100, hydration + 20);

    // Notify the main process to close the reminder window
    window.electronAPI.waterPikmin();

    // Play the "drink.mp3" sound
    const drinkAudio = new Audio('./assets/sounds/drink.mp3');
    drinkAudio.play().catch(error => {
      console.error('Error playing drink sound:', error);
    });

    // Stop Pikmin's movement during watering
    isIdle = true;
    resetAnimationState(); // Ensure no overlapping animations

    // Play water animation with cache-busting
    const waterAnimationPath = `./assets/sprites/yellow/water/${currentHat}.gif?v=${Date.now()}`;
    pikmin.style.backgroundImage = `url("${waterAnimationPath}")`;

    // Upgrade the hat
    let upgradedHat = currentHat;
    if (currentHat === 'leaf') {
      upgradedHat = 'bud';
    } else if (currentHat === 'bud') {
      upgradedHat = 'flower';
    }

    // After water animation, resume walking and play the upgrade sound
    setTimeout(() => {
      // Play the "upgrade.mp3" sound
      const upgradeAudio = new Audio('./assets/sounds/upgrade.mp3');
      upgradeAudio.play().catch(error => {
        console.error('Error playing upgrade sound:', error);
      });

      // Update the hat without resetting the animation state
      currentHat = upgradedHat;

      // Resume walking animation
      isIdle = false; // Allow movement again
      direction = 'right'; // Ensure the Pikmin continues walking right

      // Update walking animation with cache-busting
      const walkingAnimationPath = `./assets/sprites/yellow/walking/${currentHat}/right.png?v=${Date.now()}`;
      pikmin.style.backgroundImage = `url("${walkingAnimationPath}")`;

      animate(); // Resume walking animation

      // Recalculate happiness after hydration and hat upgrade
      updateHappiness();
    }, 3800); // 3800 for water animation duration (3.8 seconds)

    console.log(`Water Pikmin clicked. Hydration: ${hydration}, Current Hat: ${currentHat}`); // Debug log
  }

  // Energy refill
  function napTogether() {
    energy = Math.min(100, energy + 30);
    updateHappiness();
    setTimeout(() => {
      console.log('Nap complete!'); // Simulate 5-min rest
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
    pikmin.style.backgroundImage = `url('./assets/sprites/yellow/focus/${currentHat}.png')`;
    setTimeout(() => {
      updateHappiness();
    }, 1500); // Show focus animation briefly
  }

  // Attach event listeners to sidebar buttons
  const waterButton = document.getElementById('waterPikmin');
  if (waterButton) {
    waterButton.addEventListener('click', () => {
      console.log('Water Pikmin button clicked'); // Debug log
      waterPikmin();
    });
  } else {
    console.error('Water Pikmin button not found'); // Debug log
  }

  const napButton = document.getElementById('napTogether');
  const stretchButton = document.getElementById('stretchTime');
  const focusButton = document.getElementById('startFocus');

  if (napButton) {
    napButton.addEventListener('click', () => {
      console.log('Nap Together button clicked'); // Debug log
      napTogether();
    });
  } else {
    console.error('Nap Together button not found'); // Debug log
  }

  if (stretchButton) {
    stretchButton.addEventListener('click', () => {
      console.log('Stretch Time button clicked'); // Debug log
      stretchTime();
    });
  } else {
    console.error('Stretch Time button not found'); // Debug log
  }

  if (focusButton) {
    focusButton.addEventListener('click', () => {
      console.log('Start Focus button clicked'); // Debug log
      startFocus();
    });
  } else {
    console.error('Start Focus button not found'); // Debug log
  }

  // Debug log for click forwarding
  document.addEventListener('click', (event) => {
    console.log(`Click detected at (${event.clientX}, ${event.clientY})`); // Debug log
    window.electronAPI.forwardClick(event.clientX, event.clientY);
  });

  // Initialize status display
  updateStatusDisplay();

  function triggerAlert() {
    // Play the "hey.mp3" sound
    const audio = new Audio('./assets/sounds/hey.mp3');
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });

    // Trigger the Pikmin's idle animation
    startIdle();

    // Send a request to the main process to show the popup
    window.electronAPI.showWaterReminder();
  }

  // Set an interval to trigger the alert every 15 minutes
  setInterval(triggerAlert, 15 * 60 * 1000); // 15 minutes in milliseconds
});
