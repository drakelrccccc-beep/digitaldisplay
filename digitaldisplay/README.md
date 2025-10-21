# digitaldisplay

## Overview
The digitaldisplay project is designed to display Google Slides presentations on a Raspberry Pi screen. It accepts a Google Slides link and automatically displays the slides in a full-screen kiosk mode without user intervention.

## Features
- Full-screen display of Google Slides.
- Automatic navigation to the provided Google Slides link.
- Kiosk mode to prevent user interaction with the device.
- URL validation to ensure the provided link is accessible.

## Project Structure
```
digitaldisplay
├── src
│   ├── index.ts               # Entry point of the application
│   ├── display
│   │   ├── kiosk.ts           # Manages full-screen display
│   │   └── browser.ts         # Handles web browser instance
│   ├── services
│   │   └── slides.ts          # Fetches and validates Google Slides link
│   ├── config
│   │   └── index.ts           # Configuration settings
│   ├── utils
│   │   └── url.ts             # Utility functions for URL validation
│   └── types
│       └── index.ts           # TypeScript interfaces and types
├── scripts
│   ├── start.sh               # Script to start the application
│   └── setup.sh               # Script to set up the environment
├── systemd
│   └── digitaldisplay.service  # Systemd service configuration
├── package.json                # npm configuration file
├── tsconfig.json              # TypeScript configuration file
├── .env.example                # Example environment variables
└── README.md                  # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd digitaldisplay
   ```

2. Run the setup script to install dependencies:
   ```
   ./scripts/setup.sh
   ```

3. Configure environment variables by copying `.env.example` to `.env` and updating the values as needed.

## Usage
To start the application, run:
```
./scripts/start.sh <Google Slides Link>
```

Replace `<Google Slides Link>` with the actual link to the Google Slides presentation you want to display.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.