import { MetadataRoute } from 'next';
import { STRAPI_API_URL } from '@/utils/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dengarkan.id';

  // Base routes
  const routes = [
    '',
    '/artikel',
    '/glosari',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch blogs from CMS
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${STRAPI_API_URL}/blogs?fields[0]=slug&fields[1]=updatedAt`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (res.ok) {
      const { data } = await res.json();
      if (data && Array.isArray(data)) {
        blogRoutes = data.map((blog: any) => ({
          url: `${baseUrl}/artikel/${blog.slug}`,
          lastModified: new Date(blog.updatedAt).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  return [...routes, ...blogRoutes];
}
