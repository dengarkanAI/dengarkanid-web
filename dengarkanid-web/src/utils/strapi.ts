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

  return url;
}

export async function getGlobalSettings(locale: string) {
  try {
    const res = await fetch(`${STRAPI_API_URL}/global-setting?locale=${locale}&populate[0]=favicon&populate[1]=socialLinks.iconMedia&populate[2]=logo`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.attributes || json.data || null;
  } catch (err) {
    console.error("Error fetching global settings:", err);
    return null;
  }
}

export async function getReports(locale: string, page: number = 1, pageSize: number = 6, search?: string, year?: string, month?: string) {
  try {
    let url = `${STRAPI_API_URL}/reports?locale=${locale}&populate=*&sort=date:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    
    if (search) {
      url += `&filters[title][$containsi]=${encodeURIComponent(search)}`;
    }
    if (year) {
      url += `&filters[date][$startsWith]=${year}`;
      if (month) {
        const paddedMonth = month.padStart(2, '0');
        url += `&filters[date][$startsWith]=${year}-${paddedMonth}`;
      }
    }

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching reports:", err);
    return null;
  }
}

export async function getAllReportDates(locale: string) {
  try {
    const url = `${STRAPI_API_URL}/reports?locale=${locale}&fields[0]=date&pagination[limit]=1000&sort=date:desc`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching report dates:", err);
    return null;
  }
}
