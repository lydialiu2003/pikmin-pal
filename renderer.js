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

  pikmin.style.backgroundImage = "url('./assets/sprites/yellow/walking/leaf/right.png')";

  function animate() {
    if (isIdle) return;

    currentFrame = (currentFrame + 1) % totalFrames;
    pikmin.style.backgroundPosition = `-${currentFrame * frameWidth}px 0`;

    if (direction === 'right') {
      position += 1;
      if (position >= window.innerWidth) {
        direction = 'left';
        pikmin.style.backgroundImage = "url('./assets/sprites/yellow/walking/leaf/left.png')";
      }
    } else {
      position -= 1;
      if (position <= -24) {
        direction = 'right';
        pikmin.style.backgroundImage = "url('./assets/sprites/yellow/walking/leaf/right.png')";
      }
    }
    pikmin.style.left = `${position}px`;

    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 150);
  }

  function switchDirection() {
    if (isIdle) return;

    if (Math.random() < 0.3) { // 30% chance to switch direction
      direction = direction === 'right' ? 'left' : 'right';
      pikmin.style.backgroundImage = direction === 'right' 
        ? "url('./assets/sprites/yellow/walking/leaf/right.png')" 
        : "url('./assets/sprites/yellow/walking/leaf/left.png')";
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
          ? "url('./assets/sprites/yellow/walking/leaf/right.png')" 
          : "url('./assets/sprites/yellow/walking/leaf/left.png')";
        animate();
      }, 30000); // Idle for 30 seconds
    }
  }

  function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  setInterval(switchDirection, 10000); // Check every 10 seconds
  setInterval(startIdle, 60000); // Check every 1 minute

  animate();
});
