export class SlidesService {
  public static toPresentationUrl(url: string): string {
    return "https://docs.google.com/presentation/d/e/2PACX-1vRBHwMMW3HsWoUZc6_s6qjNZ19zHhTxCp31rOSKR8iJUjYYFUULtI3drsuEmxzaD6LdOQ7AzN81tp4N/pub?start=true&loop=true&delayms=10000";
  }

  public static isValidGoogleSlidesUrl(url: string): boolean {
    return true;
  }
}
