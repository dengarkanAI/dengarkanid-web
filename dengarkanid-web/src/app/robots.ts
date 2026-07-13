import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/auth/', '/_next/', '/api/'],
    },
    sitemap: 'https://dengarkan.id/sitemap.xml',
  };
}
