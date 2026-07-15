// Server-side: Docker internal network → CMS directly
// Client-side: relative path → browser → Caddy → CMS
export const STRAPI_API_URL =
  typeof window === 'undefined'
    ? (process.env.STRAPI_INTERNAL_URL as string) || 'http://localhost:1337/api'
    : process.env.NEXT_PUBLIC_STRAPI_URL != null
      ? (process.env.NEXT_PUBLIC_STRAPI_URL as string) + '/api'
      : 'http://localhost:1337/api';

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
      const isServer = typeof window === 'undefined';
      if (isServer) {
          // On server (SSR), use internal URL so Next.js Image optimizer can fetch from CMS container/localhost
          const internalUrl = (process.env.STRAPI_INTERNAL_URL as string) || 'http://localhost:1337/api';
          const host = internalUrl.replace('/api', '');
          return host + url;
      } else {
          // On client, use public facing URL
          const publicUrl = (process.env.NEXT_PUBLIC_STRAPI_URL as string) || 'http://localhost:1337';
          const host = publicUrl.replace('/api', '');
          return host + url;
      }
  }
  return url;
}
