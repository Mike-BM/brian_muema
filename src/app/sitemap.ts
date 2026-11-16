import { MetadataRoute } from 'next';
import { isLearningHubLive } from '@/lib/learning-hub-data';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const learningHubLive = await isLearningHubLive();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brianmuema.com';

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/learning-hub`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...(learningHubLive
      ? [
          { url: `${baseUrl}/learning-hub/data-analysis`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
          { url: `${baseUrl}/learning-hub/data-science`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        ]
      : []),
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
