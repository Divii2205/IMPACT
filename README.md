# Review Analyzer Chrome Extension

## Overview

Review Analyzer is a Chrome extension that helps users identify potentially fake or suspicious reviews on Google Maps and other Google platforms. The extension uses an intelligent algorithm to classify reviews and provide visual feedback about their authenticity.

## Features

- Real-time review analysis
- Color-coded review highlighting
- Percentage-based review classification
- Easy reporting mechanism

## Installation

### Prerequisites
- Google Chrome browser

### Steps
1. Download the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" and select the extension directory
5. The Review Analyzer icon should now appear in your Chrome toolbar

## How It Works

### Review Classification
The extension randomly classifies reviews into three categories:
- 🟢 Real: Genuine, trustworthy reviews
- 🔴 Fake: Potentially suspicious or inauthentic reviews
- 🟡 Not Sure: Reviews requiring further investigation

### User Interface
- Click the extension icon to start analysis
- Reviews are highlighted with color-coded backgrounds
- Hover over reviews to see detailed classification information
- Click "Report" to flag suspicious reviews

## Technical Details

### Key Components
- `manifest.json`: Extension configuration and permissions
- `content.js`: Dynamic review analysis and highlighting
- `popup.html` & `popup.js`: User interface and interaction logic

### Technologies Used
- Chrome Extension API
- JavaScript
- Mutation Observer for dynamic content detection
- CSS for styling

## Limitations
- Current version uses random classification (for demonstration)
- Requires actual machine learning model for production

## Future Roadmap
- Implement machine learning-based review classification
- Add more detailed analysis metrics
- Expand support for more review platforms

## Contributing
Contributions are welcome! Please submit pull requests or open issues on the project repository.

## License
[Insert your license here - e.g., MIT License]

## Disclaimer
This is a prototype extension. Always use critical thinking when evaluating online reviews.
