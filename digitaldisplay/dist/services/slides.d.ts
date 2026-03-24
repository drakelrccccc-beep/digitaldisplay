/**
 * Service to handle Google Slides URL transformations
 */
export declare class SlidesService {
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
    static toPresentationUrl(url: string): string;
    /**
     * Validate if a URL is a Google Slides URL.
     * Accepts both regular presentation URLs and published embed URLs.
     */
    static isValidGoogleSlidesUrl(url: string): boolean;
}
//# sourceMappingURL=slides.d.ts.map