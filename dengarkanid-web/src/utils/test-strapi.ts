import { STRAPI_API_URL } from "./strapi";

export function getStrapiImageUrl(imageObj: any): string {
    if (!imageObj) return '';
    let url = '';

    const getBestUrl = (imgData: any) => {
        if (imgData.formats && imgData.formats.large) return imgData.formats.large.url;
        if (imgData.formats && imgData.formats.medium) return imgData.formats.medium.url;
        return imgData.url;
    };

    if (imageObj.url) {
        url = getBestUrl(imageObj);
    }
    else if (imageObj.data?.attributes?.url) {
        url = getBestUrl(imageObj.data.attributes);
    } else if (imageObj.data?.url) {
        url = getBestUrl(imageObj.data);
    }

    if (url && url.startsWith('/')) {
        const host = STRAPI_API_URL.replace('/api', '');
        return host + url;
    }
    return url;
}

const mockFeature1 = {
  "id": 10,
  "documentId": "erskwv3zo5p8uowiosgxknep",
  "name": "Scene 1 3 new.txt",
  "url": "/uploads/Scene_1_3_new_b892873b45.txt"
};

const mockBlogThumbnail = {
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
