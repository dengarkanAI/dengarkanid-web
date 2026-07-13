export const STRAPI_API_URL = 'http://localhost:1337/api';

export function getStrapiImageUrl(imageObj: any): string {
  if (!imageObj) return '';
  let url = '';

  // Strapi v5 flat format
  if (imageObj.url) {
      url = imageObj.url;
  }
  // Strapi v4 nested format
  else if (imageObj.data?.attributes?.url) {
      url = imageObj.data.attributes.url;
  } else if (imageObj.data?.url) {
      url = imageObj.data.url;
  }

  if (url && url.startsWith('/')) {
      const host = STRAPI_API_URL.replace('/api', '');
      return host + url;
  }
  return url;
}
