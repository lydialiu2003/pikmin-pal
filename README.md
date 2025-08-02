# Pikmin Pal

NOTE: PLEASE NOTE THAT THIS IS A PERSONAL PROJECT THAT IT STILL A WORK IN PROGRESS, SOME FEATURES HAVE NOT BEEN FULLY IMPLEMNTED YET

Pikmin Pal is a fun and interactive desktop companion application built using [Electron](https://www.electronjs.org/). It features a Yellow Pikmin that walks, idles, and interacts with the user. The application also includes reminders to drink water, making it a helpful tool for users with ADHD or anyone who needs gentle hydration reminders.

---

## Features

- **Interactive Pikmin**: A Yellow Pikmin that walks across the screen, idles, and reacts to user interactions.
- **Hydration Reminders**: A non-intrusive popup in the top-right corner reminds users to drink water. The popup can be dismissed by clicking or watering the Pikmin.
- **Custom Pikmin Font**: All text in the application uses a custom Pikmin font for a cohesive aesthetic.
- **Sidebar Actions**: Includes buttons for watering the Pikmin, napping, stretching, and focusing.
- **Custom Sounds**: Plays sounds for specific actions, such as upgrading the Pikmin's hat or watering it.
- **Hat Upgrades**: The Pikmin's hat evolves from a leaf to a bud and then to a flower as it is watered.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lydialiu2003/pikmin-pal
   cd pikmin-pal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. To build the application for distribution:
   ```bash
   npm run build
   ```

---

## File Structure

- **`main.js`**: The main process file for the Electron app.
- **`renderer.js`**: Handles the Pikmin's animations, interactions, and hydration logic.
- **`preload.js`**: Exposes APIs to the renderer process for secure communication with the main process.
- **`reminderWindow.js`**: Manages the hydration reminder popup window.
- **`index.html`**: The main HTML file for the application interface.
- **`assets/`**: Contains fonts, sounds, and sprites used in the application.

---

## Assets and Attribution

- **Pikmin and Related Assets**: Pikmin and all related assets are owned by Nintendo.
- **Sprites**: The Yellow Pikmin sprites were sourced from [OmegaZero22XX on DeviantArt](https://www.deviantart.com/omegazero22xx/art/Simple-Yellow-Pikmin-Sheet-2-0-474967693).
- **Font**: The custom Pikmin font (`pikmin.otf`) is used for all text in the application.

---

## Features in Detail

### Pikmin Animations
- The Pikmin walks left and right across the screen.
- It idles when clicked or after a period of inactivity.
- The Pikmin's hat evolves as it is watered.

### Hydration Reminders
- A popup appears in the top-right corner of the screen every 15 minutes or when hydration levels drop below a threshold.
- The popup is non-intrusive and can be dismissed by clicking or watering the Pikmin.

### Sidebar Actions
- **Water Pikmin**: Waters the Pikmin, upgrades its hat, and plays a sound.
- **Nap Together**: Refills the Pikmin's energy.
- **Stretch Time**: Refills the Pikmin's activity level.
- **Start Focus**: Rewards focus points and shows a brief animation.

---

## Development Notes

### Custom Pikmin Font
The custom Pikmin font is located in `assets/fonts/pikmin.otf`. It is applied globally to all text in the application via the `@font-face` rule in `index.html`.

### Sounds
- **`drink.mp3`**: Plays when the Pikmin is watered.
- **`upgrade.mp3`**: Plays when the Pikmin's hat is upgraded.
- **`hey.mp3`**: Plays during hydration reminders.

### Hydration Logic
- Hydration levels decay over time and trigger reminders when they drop below a threshold.
- The decay rate and threshold can be adjusted for testing purposes in `renderer.js`.

---

## Packaging and Distribution

The application is packaged using `electron-builder`. The configuration is located in `package.json` under the `build` section. The following targets are supported:
- **macOS**: `dmg`
- **Windows**: `nsis`
- **Linux**: `AppImage`

To build the application, run:
```bash
npm run build
```

The distributable files will be located in the `dist/` directory.

---

## License

This project is for educational and personal use only. 


Pikmin and all related assets are owned by Nintendo. 

The sprites used in this project were sourced from [OmegaZero22XX on DeviantArt](https://www.deviantart.com/omegazero22xx/art/Simple-Yellow-Pikmin-Sheet-2-0-474967693).

---

## Acknowledgments

- **Nintendo**: For creating Pikmin and inspiring this project.
- **OmegaZero22XX**: For providing the Yellow Pikmin sprite sheet.
- **Electron**: For enabling the creation of cross-platform desktop applications.
