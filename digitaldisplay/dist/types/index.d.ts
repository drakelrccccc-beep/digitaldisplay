/**
 * Application configuration interface
 */
export interface Config {
    slidesUrl: string;
    chromiumPath?: string;
    headless?: boolean;
}
/**
 * Display interface for kiosk mode
 */
export interface Display {
    launch(url: string): Promise<void>;
    close(): Promise<void>;
}
export interface SlideLink {
    url: string;
    title?: string;
}
export interface DisplayConfig {
    fullscreen: boolean;
    refreshInterval: number;
    slideTransition: string;
}
//# sourceMappingURL=index.d.ts.map