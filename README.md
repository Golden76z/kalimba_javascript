# Kalimba Web Application

A simple virtual kalimba that allows users to play notes, record melodies, and playback their recordings. The tines are arranged in a zig-zag pattern, similar to a real kalimba.

## Features

- Playable kalimba with clickable tines and keyboard support.
- Zig-zag tine arrangement for an authentic feel.
- Audio playback using Web Audio API.
- Recording and playback functionality.
- Responsive layout that adjusts to window resizing.
- Toggleable key guide for learning note placements.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/kalimba-web.git
   cd kalimba-web
   ```

2. Open `index.html` in a web browser.

## Usage

- **Click tines** or **press assigned keys** to play notes.
- **Toggle guide** to show/hide key bindings.
- **Record button** to start/stop recording.
- **Playback button** to replay recorded sequence.

## Keyboard Bindings

Each tine is mapped to a keyboard key for easy playability:

```
 A  - C3    Z  - D3    E  - E3    R  - F3    T  - G3
 Q  - A3    S  - B3    D  - C4    F  - D4    G  - E4
 Y  - F4    U  - G4    I  - A4    O  - B4    P  - C5
 H  - D5    J  - E5    K  - F5    L  - G5    M  - A5
```

## File Structure
```
/kalimba-web
├── index.html   # Main HTML file
├── styles.css   # Styles for the kalimba
├── script.js    # Main JavaScript logic
├── sounds/      # Audio files for each note
└── README.md    # This documentation
```

## Future Improvements

- Add more visual effects for better feedback.
- Implement a save feature for recorded melodies.
- Enhance mobile responsiveness.

## License

This project is licensed under the MIT License. Feel free to modify and distribute!

