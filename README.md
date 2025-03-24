# Translation Tool Chrome Extension

A Chrome extension that adds a convenient translation drawer to any webpage, allowing you to translate text between different languages with ease.

## Features

- Floating translation drawer accessible on any webpage
- Translation between multiple languages
- Copy translated text with a single click
- Reverse translation direction with one button
- Keyboard shortcut (Shift+Enter) for quick translation
- Customizable API key through options page

## Installation

### From Source

1. Clone or download this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click on "Load unpacked" and select the downloaded directory
5. The extension is now installed and ready to use

### Setup

1. After installation, you'll need to set up your Google Translate API key
2. Right-click on the extension icon and select "Options"
3. Enter your Google Translate API key and click "Save"
4. Follow the instructions in the options page to get an API key if you don't have one

## Usage

1. Click the extension icon in the Chrome toolbar to open the translation drawer
2. Select your source and target languages
3. Enter or paste the text you want to translate
4. Click "Translate" or press Shift+Enter
5. The translated text will appear in the output box
6. Click "Copy" to copy the translated text to your clipboard
7. Click "Reverse" to swap languages and translation direction
8. Click "Clear" to reset both text fields

## Development

### Project Structure

- `manifest.json`: Extension configuration
- `src/content.js`: Main content script that creates the translation drawer
- `src/copy-button.js`: Script for handling the copy functionality
- `src/drawer-styles.css`: Styling for the translation drawer
- `src/background.js`: Background script for extension
- `src/options/`: Options page files for API key configuration

### Local Development

1. Make your changes to the source files
2. Go to `chrome://extensions/` and click the refresh icon on the extension
3. Test your changes by clicking the extension icon

## License

This project is released under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication. You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.

See the [LICENSE](LICENSE) file for more information.