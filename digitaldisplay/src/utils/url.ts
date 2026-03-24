export function isValidGoogleSlidesUrl(url: string): boolean {
    const googleSlidesRegex = /^(https?:\/\/)?(docs\.google\.com\/presentation\/d(\/e)?\/[a-zA-Z0-9-_]+)(\/.*)?$/;
    return googleSlidesRegex.test(url);
}

export function extractPresentationId(url: string): string | null {
    const publishedMatch = url.match(/\/d\/e\/([a-zA-Z0-9-_]+)/);
    if (publishedMatch) {
        return publishedMatch[1];
    }

    const standardMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return standardMatch ? standardMatch[1] : null;
}
