import puppeteer, { Browser, Page } from 'puppeteer';
import { Display } from '../types';

/**
 * Chromium-based kiosk display for Raspberry Pi
 * Optimized for Raspberry Pi 2 (32-bit, limited resources)
 */
export class ChromiumDisplay implements Display {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private watchdogTimer: NodeJS.Timeout | null = null;

  /**
   * Launch Chromium in kiosk mode and navigate to the URL
   */
  async launch(url: string): Promise<void> {
    try {
      console.log('Launching Chromium in kiosk mode...');
      console.log(`URL: ${url}`);

      this.browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/chromium-browser',
        defaultViewport: null,
        args: [
          '--kiosk',
          '--start-fullscreen',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
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
          '--mute-audio',
          '--autoplay-policy=no-user-gesture-required',
          '--window-position=0,0',
          '--window-size=1920,1080',
          '--check-for-update-interval=31536000',
          '--disk-cache-size=0',
          '--media-cache-size=0',
        ],
        ignoreDefaultArgs: ['--enable-automation'],
      });

      const pages = await this.browser.pages();
      this.page = pages[0] || (await this.browser.newPage());

      // Hide cursor inside browser window
      await this.page.addStyleTag({
        content: '* { cursor: none !important; }'
      });

      // Use 'load' instead of 'networkidle2' — more reliable on slow Pi 2
      await this.page.goto(url, {
        waitUntil: 'load',
        timeout: 90000,
      });

      console.log('Chromium launched successfully in kiosk mode');

      // Start watchdog to reload every 30 minutes if slides get stuck
      this.startWatchdog(url);

      // Handle page crash
      this.page.on('error', (error) => {
        console.error('Page crashed:', error);
        this.restart(url);
      });

      // Log page errors but don't restart for these
      this.page.on('pageerror', (error) => {
        console.error('Page error:', error);
      });

      // Handle silent browser disconnect
      this.browser.on('disconnected', () => {
        console.error('Browser disconnected, restarting...');
        this.restart(url);
      });

    } catch (error) {
      console.error('Failed to launch Chromium:', error);
      throw error;
    }
  }

  /**
   * Reload page every 30 minutes to prevent slides getting stuck
   */
  private startWatchdog(url: string): void {
    if (this.watchdogTimer) clearInterval(this.watchdogTimer);
    this.watchdogTimer = setInterval(async () => {
      try {
        console.log('Watchdog: reloading page...');
        if (this.page) {
          await this.page.reload({ waitUntil: 'load', timeout: 30000 });
        }
      } catch (error) {
        console.error('Watchdog reload failed, restarting:', error);
        this.restart(url);
      }
    }, 30 * 60 * 1000);
  }

  /**
   * Close the browser
   */
  async close(): Promise<void> {
    try {
      if (this.watchdogTimer) {
        clearInterval(this.watchdogTimer);
        this.watchdogTimer = null;
      }
      if (this.browser) {
        console.log('Closing Chromium...');
        await this.browser.close();
        this.browser = null;
        this.page = null;
        console.log('Chromium closed');
      }
    } catch (error) {
      console.error('Error closing Chromium:', error);
    }
  }

  /**
   * Restart the display (useful for error recovery)
   */
  private async restart(url: string): Promise<void> {
    console.log('Restarting display...');
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer);
      this.watchdogTimer = null;
    }
    await this.close();
    setTimeout(() => {
      this.launch(url).catch((error) => {
        console.error('Failed to restart display:', error);
      });
    }, 5000);
  }
}
