"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromiumDisplay = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
/**
 * Chromium-based kiosk display for Raspberry Pi
 * Optimized for Raspberry Pi 2 (32-bit, limited resources)
 */
class ChromiumDisplay {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    /**
     * Launch Chromium in kiosk mode and navigate to the URL
     */
    async launch(url) {
        try {
            console.log('Launching Chromium in kiosk mode...');
            console.log(`URL: ${url}`);
            // Launch Chromium with optimized flags for Raspberry Pi 2
            this.browser = await puppeteer_1.default.launch({
                headless: false, // Show GUI
                executablePath: '/usr/bin/chromium-browser', // Raspberry Pi OS default Chromium
                args: [
                    '--kiosk', // Full-screen kiosk mode
                    '--start-fullscreen',
                    '--no-sandbox', // Required for running as root (systemd)
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage', // Prevent shared memory issues on Pi
                    '--disable-gpu', // GPU acceleration can be unstable on Pi 2
                    '--disable-software-rasterizer',
                    '--disable-extensions',
                    '--disable-plugins',
                    '--disable-sync',
                    '--disable-translate',
                    '--disable-features=TranslateUI',
                    '--disable-infobars',
                    '--no-first-run',
                    '--no-default-browser-check',
                    '--disable-background-networking',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-breakpad',
                    '--disable-client-side-phishing-detection',
                    '--disable-component-extensions-with-background-pages',
                    '--disable-default-apps',
                    '--disable-hang-monitor',
                    '--disable-ipc-flooding-protection',
                    '--disable-popup-blocking',
                    '--disable-prompt-on-repost',
                    '--disable-renderer-backgrounding',
                    '--metrics-recording-only',
                    '--mute-audio', // Mute audio (optional, remove if you need sound)
                    '--autoplay-policy=no-user-gesture-required', // Allow autoplay
                    '--window-position=0,0',
                    '--window-size=1920,1080',
                    '--check-for-update-interval=31536000', // Disable update checks
                ],
                ignoreDefaultArgs: ['--enable-automation'], // Hide "Chrome is being controlled" banner
            });
            // Get the first page (Chromium opens with a blank page)
            const pages = await this.browser.pages();
            this.page = pages[0] || (await this.browser.newPage());
            // Hide cursor by injecting CSS
            await this.page.addStyleTag({
                content: '* { cursor: none !important; }'
            });
            // Navigate to the URL
            await this.page.goto(url, {
                waitUntil: 'networkidle2', // Wait for network to be idle
                timeout: 60000, // 60 second timeout for slow Pi 2
            });
            console.log('Chromium launched successfully in kiosk mode');
            // Keep the page alive and handle errors
            this.page.on('error', (error) => {
                console.error('Page crashed:', error);
                this.restart(url);
            });
            this.page.on('pageerror', (error) => {
                console.error('Page error:', error);
            });
        }
        catch (error) {
            console.error('Failed to launch Chromium:', error);
            throw error;
        }
    }
    /**
     * Close the browser
     */
    async close() {
        try {
            if (this.browser) {
                console.log('Closing Chromium...');
                await this.browser.close();
                this.browser = null;
                this.page = null;
                console.log('Chromium closed');
            }
        }
        catch (error) {
            console.error('Error closing Chromium:', error);
        }
    }
    /**
     * Restart the display (useful for error recovery)
     */
    async restart(url) {
        console.log('Restarting display...');
        await this.close();
        setTimeout(() => {
            this.launch(url).catch((error) => {
                console.error('Failed to restart display:', error);
            });
        }, 5000); // Wait 5 seconds before restart
    }
}
exports.ChromiumDisplay = ChromiumDisplay;
//# sourceMappingURL=chromium.js.map