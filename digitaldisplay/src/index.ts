import { loadConfig } from './config';
import { ChromiumDisplay } from './display/chromium';
import { SlidesService } from './services/slides';

/**
 * Main entry point for Digital Display application
 * Displays Google Slides in kiosk mode on Raspberry Pi
 */
async function main() {
  console.log('=== Digital Display Application Starting ===');

  try {
    // Load configuration from .env
    const config = loadConfig();
    console.log('Configuration loaded successfully');

    // Validate Google Slides URL
   /* if (!SlidesService.isValidGoogleSlidesUrl(config.slidesUrl)) {
      throw new Error(
        `Invalid Google Slides URL: ${config.slidesUrl}\n` +
        'Please provide a valid Google Slides URL in your .env file.\n' +
        'Example: https://docs.google.com/presentation/d/your-presentation-id/edit'
      );
    } */

    // Convert to presentation mode URL
    //const presentationUrl = SlidesService.toPresentationUrl(config.slidesUrl); we don't need this. we are using a direct link
    const presentationUrl = config.slidesUrl;
    console.log('Converted to presentation URL:', presentationUrl);

    // Launch Chromium display
    const display = new ChromiumDisplay();
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

  } catch (error) {
    console.error('=== Application Error ===');
    console.error(error);
    process.exit(1);
  }
}

// Start the application
main();
