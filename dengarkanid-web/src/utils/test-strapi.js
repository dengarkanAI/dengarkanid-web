"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStrapiImageUrl = getStrapiImageUrl;
var strapi_1 = require("./strapi");
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
    if (imageObj.url) {
        url = getBestUrl(imageObj);
    }
    else if ((_b = (_a = imageObj.data) === null || _a === void 0 ? void 0 : _a.attributes) === null || _b === void 0 ? void 0 : _b.url) {
        url = getBestUrl(imageObj.data.attributes);
    }
    else if ((_c = imageObj.data) === null || _c === void 0 ? void 0 : _c.url) {
        url = getBestUrl(imageObj.data);
    }
    if (url && url.startsWith('/')) {
        var host = strapi_1.STRAPI_API_URL.replace('/api', '');
        return host + url;
    }
    return url;
}
var mockFeature1 = {
    "id": 10,
    "documentId": "erskwv3zo5p8uowiosgxknep",
    "name": "Scene 1 3 new.txt",
    "url": "/uploads/Scene_1_3_new_b892873b45.txt"
};
var mockBlogThumbnail = {
    "id": 13,
    "documentId": "wzwgwa1or22wcwjxstenz75i",
    "name": "Ibukota-Jakarta.jpg",
    "formats": {
        "thumbnail": {
            "url": "/uploads/thumbnail_Ibukota_Jakarta_a59c33b502.jpg"
        },
        "small": {
            "url": "/uploads/small_Ibukota_Jakarta_a59c33b502.jpg"
        }
    },
    "url": "/uploads/Ibukota_Jakarta_a59c33b502.jpg"
};
console.log("feature1 url:", getStrapiImageUrl(mockFeature1));
console.log("blog thumbnail url:", getStrapiImageUrl(mockBlogThumbnail));
