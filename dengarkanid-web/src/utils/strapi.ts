export const STRAPI_API_URL = 'http://localhost:1337/api';

export function getStrapiImageUrl(imageObj: any): string {
  if (!imageObj) return '';
  let url = '';

  const getBestUrl = (imgData: any) => {
      if (imgData.formats && imgData.formats.large) return imgData.formats.large.url;
      if (imgData.formats && imgData.formats.medium) return imgData.formats.medium.url;
      return imgData.url;
  };

  // Strapi v5 flat format
  if (imageObj.url) {
      url = getBestUrl(imageObj);
  }
  // Strapi v4 nested format
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
