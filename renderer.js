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

  pikmin.style.backgroundImage = `url('./assets/sprites/yellow/walking/${currentHat}/${direction}.png')`;

  function animate() {
    // Ensure the animation cycles through the walking frames
    currentFrame = (currentFrame + 1) % totalFrames;
    pikmin.style.backgroundPosition = `-${currentFrame * frameWidth}px 0`;

    if (!isIdle) {
      // Move Pikmin horizontally
      if (direction === 'right') {
        position += 1;
        if (position >= window.innerWidth) {
          direction = 'left';
          pikmin.style.backgroundImage = `url('./assets/sprites/yellow/walking/${currentHat}/left.png')`;
        }
      } else {
        position -= 1;
        if (position <= -24) {
          direction = 'right';
          pikmin.style.backgroundImage = `url('./assets/sprites/yellow/walking/${currentHat}/right.png')`;
        }
      }
      pikmin.style.left = `${position}px`;
    }

    // Continue animation
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 150); // Corrected to 150ms per frame
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
    if (Math.random() < 0.5) { // 50% chance to start idle animation
      isIdle = true;
      let idleFrame = 0;

      function playIdleFrame() {
        if (!isIdle) return;

        pikmin.style.backgroundPosition = `-${idleFrame * frameWidth}px 0`;
        idleFrame = (idleFrame + 1) % idleFrames;

        clearTimeout(idleFrameTimeout);
        idleFrameTimeout = setTimeout(playIdleFrame, getRandomInterval(200, 800)); // Randomize between 200 to 800 ms
      }

      pikmin.style.backgroundImage = "url('./assets/sprites/yellow/idle/leaf.png')";
      playIdleFrame();

      setTimeout(() => {
        isIdle = false;
        pikmin.style.backgroundImage = direction === 'right' 
          ? `url('./assets/sprites/yellow/walking/${currentHat}/right.png')` 
          : `url('./assets/sprites/yellow/walking/${currentHat}/left.png')`;
        animate();
      }, 30000); // Idle for 30 seconds
    }
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
      let idleFrame = 0;

      function playIdleFrame() {
        if (!isIdle) return;

        pikmin.style.backgroundPosition = `-${idleFrame * frameWidth}px 0`;
        idleFrame = (idleFrame + 1) % idleFrames;

        clearTimeout(idleFrameTimeout);
        idleFrameTimeout = setTimeout(playIdleFrame, getRandomInterval(200, 800)); // Randomize between 200 to 800 ms
      }

      pikmin.style.backgroundImage = "url('./assets/sprites/yellow/idle/leaf.png')";
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
        animate();
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

    // Determine the correct image path based on the current state and direction
    if (isIdle) {
      pikmin.style.backgroundImage = `url('./assets/sprites/yellow/idle/${currentHat}.png')`;
    } else {
      pikmin.style.backgroundImage = `url('./assets/sprites/yellow/walking/${currentHat}/${direction}.png')`;
    }

    // Ensure the animation continues after a hat change
    if (!isIdle) {
      animate();
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

  // Add a global mousemove listener to toggle mouse events dynamically
  document.addEventListener('mousemove', toggleMouseEvents);

  // Start the Pikmin walking immediately
  animate();

  setInterval(switchDirection, 10000); // Check every 10 seconds
  setInterval(startIdle, 60000); // Check every 1 minute

  window.electronAPI.forwardClick = (mouseX, mouseY) => {
    handleClick({ clientX: mouseX, clientY: mouseY });
  };
});
