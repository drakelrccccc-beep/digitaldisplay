"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.loadConfig = loadConfig;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
/**
 * Load and validate application configuration
 */
function loadConfig() {
    const slidesUrl = process.env.SLIDES_URL;
    if (!slidesUrl) {
        throw new Error('SLIDES_URL environment variable is required. Please set it in your .env file.');
    }
    // Validate URL format
    try {
        new URL(slidesUrl);
    }
    catch (error) {
        throw new Error(`Invalid SLIDES_URL: ${slidesUrl}. Please provide a valid URL.`);
    }
    const config = {
        slidesUrl,
        chromiumPath: process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser',
        headless: false, // Always show GUI for kiosk display
    };
    return config;
}
// Legacy config for backward compatibility
exports.config = {
    googleSlidesUrl: process.env.GOOGLE_SLIDES_URL || '',
    displayDuration: parseInt(process.env.DISPLAY_DURATION || '30000', 10),
    fullscreen: process.env.FULLSCREEN === 'true' || true,
};
//# sourceMappingURL=index.js.map