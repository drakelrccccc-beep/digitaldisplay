/**
 * Service to handle Google Slides URL transformations
 */
export declare class SlidesService {
    /**
     * Convert a Google Slides URL to presentation mode URL
     * Supports various Google Slides URL formats:
     * - /d/{id}/edit
     * - /d/{id}/present
     * - /d/{id}/pub
     *
     * @param url - Original Google Slides URL
     * @returns Presentation mode URL with auto-advance
     */
    static toPresentationUrl(url: string): string;
    /**
     * Validate if a URL is a Google Slides URL
     */
    static isValidGoogleSlidesUrl(url: string): boolean;
}
//# sourceMappingURL=slides.d.ts.map