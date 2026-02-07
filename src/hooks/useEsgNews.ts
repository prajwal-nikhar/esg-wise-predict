import { useEffect, useState } from 'react';
import { ESGNews } from '@/lib/types';

const API_URL =
  'https://api.gdeltproject.org/api/v2/doc/doc?query=(ESG%20OR%20climate%20OR%20sustainability%20OR%20governance)%20sourcelang:eng&mode=ArtList&maxrecords=50&sort=Date&format=json';

/**
 * Safely parse GDELT seendate (YYYYMMDDHHMMSS)
 * Returns Date | null — NEVER throws
 */
const parseGdeltDate = (dateStr?: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string' || dateStr.length !== 14) {
    return null;
  }

  const iso = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(
    6,
    8
  )}T${dateStr.slice(8, 10)}:${dateStr.slice(10, 12)}:${dateStr.slice(
    12,
    14
  )}Z`;

  const date = new Date(iso);
  return isNaN(date.getTime()) ? null : date;
};

export function useEsgNews() {
  const [news, setNews] = useState<ESGNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.articles)) {
          throw new Error('Invalid GDELT response');
        }

        const articles: ESGNews[] = data.articles.map((article: any) => ({
          title: article.title ?? 'Untitled',
          link: article.url,
          source: article.domain ?? 'Unknown source',
          published_date: parseGdeltDate(article.seendate), // 👈 nullable
        }));

        setNews(articles);
      } catch (err: any) {
        console.error('Failed to fetch ESG news:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, isLoading, error };
}
