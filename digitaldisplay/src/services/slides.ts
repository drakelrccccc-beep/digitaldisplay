/**
 * Service to handle Google Slides URL transformations
 */
export class SlidesService {
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
  public static toPresentationUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // Extract presentation ID from various URL formats
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
    } catch (error) {
      throw new Error(`Failed to convert URL to presentation mode: ${error}`);
    }
  }

  /**
   * Validate if a URL is a Google Slides URL
   */
  public static isValidGoogleSlidesUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname === 'docs.google.com' &&
        urlObj.pathname.includes('/presentation/')
      );
    } catch {
      return false;
    }
  }
}
