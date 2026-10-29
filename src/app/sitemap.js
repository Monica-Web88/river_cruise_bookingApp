import { getAllCruises } from '@/lib/catalog';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export default function sitemap() {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/cruises`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/inquire`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...getAllCruises().map((c) => ({
      url: `${siteUrl}/cruises/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
  ];
}
