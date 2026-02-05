 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { ESGPillar, PILLAR_LABELS } from '@/lib/types';
 import { Leaf, Users, Building } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface ESGScoreCardProps {
   pillar: ESGPillar;
   score: number | null;
   maxScore?: number;
   showLabel?: boolean;
   size?: 'sm' | 'md' | 'lg';
 }
 
 const pillarIcons = {
   environmental: Leaf,
   social: Users,
   governance: Building,
 };
 
 const pillarColors = {
   environmental: 'bg-environmental text-environmental-foreground',
   social: 'bg-social text-social-foreground',
   governance: 'bg-governance text-governance-foreground',
 };
 
 const progressColors = {
   environmental: '[&>div]:bg-environmental',
   social: '[&>div]:bg-social',
   governance: '[&>div]:bg-governance',
 };
 
 export function ESGScoreCard({ pillar, score, maxScore = 100, showLabel = true, size = 'md' }: ESGScoreCardProps) {
   const Icon = pillarIcons[pillar];
   const percentage = score !== null ? (score / maxScore) * 100 : 0;
 
   const sizeClasses = {
     sm: 'p-3',
     md: 'p-4',
     lg: 'p-6',
   };
 
   const iconSizes = {
     sm: 'h-4 w-4',
     md: 'h-5 w-5',
     lg: 'h-6 w-6',
   };
 
   return (
     <Card className={cn('transition-shadow hover:shadow-md', sizeClasses[size])}>
       <CardHeader className="p-0 pb-3">
         <CardTitle className="flex items-center gap-2 text-sm font-medium">
           <div className={cn('p-1.5 rounded-md', pillarColors[pillar])}>
             <Icon className={iconSizes[size]} />
           </div>
           {showLabel && PILLAR_LABELS[pillar]}
         </CardTitle>
       </CardHeader>
       <CardContent className="p-0 space-y-2">
         <div className="flex items-baseline gap-1">
           <span className={cn('font-bold', size === 'lg' ? 'text-3xl' : 'text-2xl')}>
             {score !== null ? score.toFixed(0) : '—'}
           </span>
           <span className="text-muted-foreground text-sm">/ {maxScore}</span>
         </div>
         <Progress value={percentage} className={cn('h-2', progressColors[pillar])} />
       </CardContent>
     </Card>
   );
 }