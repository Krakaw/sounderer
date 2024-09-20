# Sounderer Firefox Extension

![Sounderer Logo](logo.png)

This is a simple Firefox extension that allows users to record audio using their microphone and then play back the recording. The extension features a clickable microphone logo to start and stop the recording, with a visual indicator to show the recording state.

## Features

- Record audio using the microphone directly from the browser.
- Playback the recorded audio automatically after stopping the recording.
- A clickable microphone icon acts as the control for starting and stopping the recording.
- Visual feedback (opacity change) on the microphone icon to indicate the recording state.

## How It Works

1. **Click the microphone logo** to start recording.
2. The logo will change its appearance (opacity and scale) to indicate that recording is in progress.
3. **Click the logo again** to stop recording.
4. The recorded audio will play automatically.
5. The icon will revert to its normal state when recording is stopped.

## Installation for Development

1. Clone or download this repository.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click on **"Load Temporary Add-on..."**.
4. Select the `manifest.json` file from the directory where you downloaded this extension.
5. The extension will now be loaded, and the microphone icon will appear in your toolbar.

## Files

- `manifest.json`: Describes the extension's metadata, permissions, and resources.
- `popup.html`: The HTML structure for the extension's popup, which includes the clickable microphone logo.
- `popup.js`: JavaScript logic that handles audio recording, playback, and visual state changes.
- `logo.png`: The clickable microphone logo that acts as the user interface for starting and stopping the recording.
  
## Packaging the Extension

To package the extension:

1. Ensure all files are organized in the same directory.
2. Zip the contents of the directory (including `manifest.json`, `popup.html`, `popup.js`, `logo.png`).
3. The resulting ZIP file can be used for manual installation or submitted to Mozilla Add-ons (AMO).

To zip the contents on Linux/macOS, run the following command:

```bash
zip -r sounderer.zip ./
```