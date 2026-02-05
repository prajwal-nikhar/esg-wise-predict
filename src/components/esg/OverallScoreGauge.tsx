 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { cn } from '@/lib/utils';
 
 interface OverallScoreGaugeProps {
   score: number | null;
   maxScore?: number;
   percentile?: number | null;
   className?: string;
 }
 
 function getScoreColor(score: number | null): string {
   if (score === null) return 'text-muted-foreground';
   if (score >= 80) return 'text-score-excellent';
   if (score >= 60) return 'text-score-good';
   if (score >= 40) return 'text-score-average';
   if (score >= 20) return 'text-score-poor';
   return 'text-score-critical';
 }
 
 function getScoreLabel(score: number | null): string {
   if (score === null) return 'Not Rated';
   if (score >= 80) return 'Excellent';
   if (score >= 60) return 'Good';
   if (score >= 40) return 'Average';
   if (score >= 20) return 'Below Average';
   return 'Needs Improvement';
 }
 
 export function OverallScoreGauge({ score, maxScore = 100, percentile, className }: OverallScoreGaugeProps) {
   const percentage = score !== null ? (score / maxScore) * 100 : 0;
   const circumference = 2 * Math.PI * 45;
   const strokeDashoffset = circumference - (percentage / 100) * circumference;
 
   return (
     <Card className={cn('', className)}>
       <CardHeader className="pb-2">
         <CardTitle className="text-lg">Overall ESG Score</CardTitle>
       </CardHeader>
       <CardContent className="flex flex-col items-center">
         <div className="relative w-36 h-36">
           <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
             <circle
               cx="50"
               cy="50"
               r="45"
               fill="none"
               stroke="hsl(var(--muted))"
               strokeWidth="8"
             />
             <circle
               cx="50"
               cy="50"
               r="45"
               fill="none"
               stroke="hsl(var(--primary))"
               strokeWidth="8"
               strokeLinecap="round"
               strokeDasharray={circumference}
               strokeDashoffset={strokeDashoffset}
               className="transition-all duration-500"
             />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className={cn('text-4xl font-bold', getScoreColor(score))}>
               {score !== null ? score.toFixed(0) : '—'}
             </span>
             <span className="text-xs text-muted-foreground">/ {maxScore}</span>
           </div>
         </div>
         <div className="mt-4 text-center">
           <p className={cn('font-semibold', getScoreColor(score))}>{getScoreLabel(score)}</p>
           {percentile !== null && percentile !== undefined && (
             <p className="text-sm text-muted-foreground mt-1">
               Top {(100 - percentile).toFixed(0)}% in your industry
             </p>
           )}
         </div>
       </CardContent>
     </Card>
   );
 }