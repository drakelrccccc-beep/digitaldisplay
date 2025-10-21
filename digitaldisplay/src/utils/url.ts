export function isValidGoogleSlidesUrl(url: string): boolean {
    const googleSlidesRegex = /^(https?:\/\/)?(www\.)?(slides\.google\.com\/presentation\/d\/[a-zA-Z0-9-_]+)(\/.*)?$/;
    return googleSlidesRegex.test(url);
}

export function extractPresentationId(url: string): string | null {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}