"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const chromium_1 = require("./display/chromium");
const slides_1 = require("./services/slides");
/**
 * Main entry point for Digital Display application
 * Displays Google Slides in kiosk mode on Raspberry Pi
 */
async function main() {
    console.log('=== Digital Display Application Starting ===');
    try {
        // Load configuration from .env
        const config = (0, config_1.loadConfig)();
        console.log('Configuration loaded successfully');
        // Validate Google Slides URL
        if (!slides_1.SlidesService.isValidGoogleSlidesUrl(config.slidesUrl)) {
            throw new Error(`Invalid Google Slides URL: ${config.slidesUrl}\n` +
                'Please provide a valid Google Slides URL in your .env file.\n' +
                'Example: https://docs.google.com/presentation/d/your-presentation-id/edit');
        }
        // Convert to presentation mode URL
        const presentationUrl = slides_1.SlidesService.toPresentationUrl(config.slidesUrl);
        console.log('Converted to presentation URL:', presentationUrl);
        // Launch Chromium display
        const display = new chromium_1.ChromiumDisplay();
        await display.launch(presentationUrl);
        console.log('=== Digital Display Running ===');
        console.log('Press Ctrl+C to exit');
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\nShutting down...');
            await display.close();
            process.exit(0);
        });
        process.on('SIGTERM', async () => {
            console.log('\nShutting down...');
            await display.close();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('=== Application Error ===');
        console.error(error);
        process.exit(1);
    }
}
// Start the application
main();
//# sourceMappingURL=index.js.map