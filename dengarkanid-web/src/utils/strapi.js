"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRAPI_API_URL = void 0;
exports.getStrapiImageUrl = getStrapiImageUrl;
exports.STRAPI_API_URL = 'http://localhost:1337/api';
function getStrapiImageUrl(imageObj) {
    var _a, _b, _c;
    if (!imageObj)
        return '';
    var url = '';
    var getBestUrl = function (imgData) {
        if (imgData.formats && imgData.formats.large)
            return imgData.formats.large.url;
        if (imgData.formats && imgData.formats.medium)
            return imgData.formats.medium.url;
        return imgData.url;
    };
    // Strapi v5 flat format
    if (imageObj.url) {
        url = getBestUrl(imageObj);
    }
    // Strapi v4 nested format
    else if ((_b = (_a = imageObj.data) === null || _a === void 0 ? void 0 : _a.attributes) === null || _b === void 0 ? void 0 : _b.url) {
        url = getBestUrl(imageObj.data.attributes);
    }
    else if ((_c = imageObj.data) === null || _c === void 0 ? void 0 : _c.url) {
        url = getBestUrl(imageObj.data);
    }
    if (url && url.startsWith('/')) {
        var host = exports.STRAPI_API_URL.replace('/api', '');
        return host + url;
    }
    return url;
}
