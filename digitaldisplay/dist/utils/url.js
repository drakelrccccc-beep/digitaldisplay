"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidGoogleSlidesUrl = isValidGoogleSlidesUrl;
exports.extractPresentationId = extractPresentationId;
function isValidGoogleSlidesUrl(url) {
    const googleSlidesRegex = /^(https?:\/\/)?(docs\.google\.com\/presentation\/d(\/e)?\/[a-zA-Z0-9-_]+)(\/.*)?$/;
    return googleSlidesRegex.test(url);
}
function extractPresentationId(url) {
    const publishedMatch = url.match(/\/d\/e\/([a-zA-Z0-9-_]+)/);
    if (publishedMatch) {
        return publishedMatch[1];
    }
    const standardMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return standardMatch ? standardMatch[1] : null;
}
//# sourceMappingURL=url.js.map