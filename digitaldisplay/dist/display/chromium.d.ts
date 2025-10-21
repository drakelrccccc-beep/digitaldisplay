import { Display } from '../types';
/**
 * Chromium-based kiosk display for Raspberry Pi
 * Optimized for Raspberry Pi 2 (32-bit, limited resources)
 */
export declare class ChromiumDisplay implements Display {
    private browser;
    private page;
    /**
     * Launch Chromium in kiosk mode and navigate to the URL
     */
    launch(url: string): Promise<void>;
    /**
     * Close the browser
     */
    close(): Promise<void>;
    /**
     * Restart the display (useful for error recovery)
     */
    private restart;
}
//# sourceMappingURL=chromium.d.ts.map