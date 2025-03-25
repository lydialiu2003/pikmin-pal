console.log('hat-selector.js loaded'); // Debug log

if (window.electronAPI) {
  console.log('window.electronAPI is accessible'); // Debug log
} else {
  console.error('window.electronAPI is not accessible'); // Debug log
}

document.addEventListener('DOMContentLoaded', () => {
  const leafButton = document.getElementById('leaf');
  const flowerButton = document.getElementById('flower');
  const budButton = document.getElementById('bud');

  // Attach event listeners to buttons to send the correct hat name
  leafButton.addEventListener('click', () => {
    window.electronAPI.changeHat('leaf');
  });

  flowerButton.addEventListener('click', () => {
    window.electronAPI.changeHat('flower');
  });

  budButton.addEventListener('click', () => {
    window.electronAPI.changeHat('bud');
  });
});
