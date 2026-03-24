import dotenv from 'dotenv';
import { Config } from '../types';

dotenv.config();

/**
 * Load application configuration
 */
export function loadConfig(): Config {
  const config: Config = {
    slidesUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vRBHwMMW3HsWoUZc6_s6qjNZ19zHhTxCp31rOSKR8iJUjYYFUULtI3drsuEmxzaD6LdOQ7AzN81tp4N/pub?start=true&loop=true&delayms=10000',
    chromiumPath: process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser',
    headless: false,
  };
  return config;
}
