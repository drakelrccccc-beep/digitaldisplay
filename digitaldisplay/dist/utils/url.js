"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidGoogleSlidesUrl = isValidGoogleSlidesUrl;
exports.extractPresentationId = extractPresentationId;
function isValidGoogleSlidesUrl(url) {
    const googleSlidesRegex = /^(https?:\/\/)?(www\.)?(slides\.google\.com\/presentation\/d\/[a-zA-Z0-9-_]+)(\/.*)?$/;
    return googleSlidesRegex.test(url);
}
function extractPresentationId(url) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}
//# sourceMappingURL=url.js.map