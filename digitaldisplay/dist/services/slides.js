"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidesService = void 0;
/**
 * Service to handle Google Slides URL transformations
 */
class SlidesService {
    /**
     * Convert a Google Slides URL to presentation mode URL.
     * Supports the following Google Slides URL formats:
     * - Published embed URL: /d/e/{publishedId}/embed  (used as-is)
     * - Edit URL:            /d/{id}/edit
     * - Present URL:         /d/{id}/present
     * - Pub URL:             /d/{id}/pub
     *
     * @param url - Original Google Slides URL
     * @returns Presentation mode embed URL with auto-advance and loop
     */
    static toPresentationUrl(url) {
        try {
            const urlObj = new URL(url);
            // If the URL is already a published embed URL (/d/e/{id}/embed),
            // return it as-is so all existing query parameters are preserved.
            if (urlObj.pathname.includes('/embed')) {
                return url;
            }
            // Extract presentation ID from regular edit/present/pub URLs (/d/{id}/...)
            const match = urlObj.pathname.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (!match || !match[1]) {
                throw new Error('Invalid Google Slides URL: Could not extract presentation ID');
            }
            const presentationId = match[1];
            // Build presentation URL with embed parameters
            // start=true: Auto-start presentation
            // loop=true: Loop slides continuously
            // delayms=3000: Default 3 seconds between slides (user can override in Slides settings)
            const presentUrl = `https://docs.google.com/presentation/d/${presentationId}/embed?start=true&loop=true&delayms=3000`;
            return presentUrl;
        }
        catch (error) {
            throw new Error(`Failed to convert URL to presentation mode: ${error}`);
        }
    }
    /**
     * Validate if a URL is a Google Slides URL.
     * Accepts both regular presentation URLs and published embed URLs.
     */
    static isValidGoogleSlidesUrl(url) {
        try {
            const urlObj = new URL(url);
            return (urlObj.hostname === 'docs.google.com' &&
                urlObj.pathname.includes('/presentation/'));
        }
        catch {
            return false;
        }
    }
}
exports.SlidesService = SlidesService;
//# sourceMappingURL=slides.js.map