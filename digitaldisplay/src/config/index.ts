import dotenv from 'dotenv';
import { Config } from '../types';

// Load environment variables from .env file
dotenv.config();

/**
 * Load and validate application configuration
 */
export function loadConfig(): Config {
  const slidesUrl = process.env.SLIDES_URL;

  if (!slidesUrl) {
    throw new Error('SLIDES_URL environment variable is required. Please set it in your .env file.');
  }

  // Validate URL format
  try {
    new URL(slidesUrl);
  } catch (error) {
    throw new Error(`Invalid SLIDES_URL: ${slidesUrl}. Please provide a valid URL.`);
  }

  const config: Config = {
    slidesUrl,
    chromiumPath: process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser',
    headless: false, // Always show GUI for kiosk display
  };

  return config;
}

// Legacy config for backward compatibility
export const config = {
    googleSlidesUrl: process.env.GOOGLE_SLIDES_URL || '',
    displayDuration: parseInt(process.env.DISPLAY_DURATION || '30000', 10),
    fullscreen: process.env.FULLSCREEN === 'true' || true,
};
