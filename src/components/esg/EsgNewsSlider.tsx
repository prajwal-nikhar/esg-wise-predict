import { useEsgNews } from '@/hooks/useEsgNews';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { format, isValid } from 'date-fns';

export default function EsgNewsSlider() {
  const { news, isLoading, error } = useEsgNews();

  if (isLoading) return <div className="text-center p-4">Loading ESG News...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error loading news.</div>;
  if (!news.length) return <div className="text-center p-4">No ESG news available.</div>;

  const duplicatedNews = [...news, ...news];

  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        ESG News & Insights
      </h2>

      <div className="relative w-full overflow-hidden">
        <div className="animate-scroll">
          {duplicatedNews.map((item, index) => (
            <Card key={index} className="flex-shrink-0 w-80 mx-4">
              <CardHeader>
                <CardTitle className="text-base h-16 overflow-hidden">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.source}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.published_date && isValid(item.published_date)
                    ? format(item.published_date, 'MMM d, yyyy')
                    : 'Date unavailable'}
                </p>
              </CardContent>

              <CardFooter>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'link' }), 'p-0')}
                >
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
