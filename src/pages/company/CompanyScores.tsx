 import { DashboardLayout } from '@/components/layout/DashboardLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { ESGScoreCard } from '@/components/esg/ESGScoreCard';
 import { OverallScoreGauge } from '@/components/esg/OverallScoreGauge';
 import { useCompany } from '@/hooks/useCompany';
 import { useCompanyScores } from '@/hooks/useCompanyScores';
 import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
 import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
 import { Loader2 } from 'lucide-react';
 import { format } from 'date-fns';
 
 export default function CompanyScores() {
   const { company, isLoading: companyLoading } = useCompany();
   const { scores, latestScore, isLoading: scoresLoading } = useCompanyScores(company?.id);
 
   if (companyLoading || scoresLoading) {
     return (
       <DashboardLayout>
         <div className="flex items-center justify-center min-h-[60vh]">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
       </DashboardLayout>
     );
   }
 
   const pillarData = [
     { name: 'Environmental', score: latestScore?.environmental_score || 0, fill: 'hsl(var(--environmental))' },
     { name: 'Social', score: latestScore?.social_score || 0, fill: 'hsl(var(--social))' },
     { name: 'Governance', score: latestScore?.governance_score || 0, fill: 'hsl(var(--governance))' },
   ];
 
   const trendData = scores?.slice(0, 10).reverse().map((s) => ({
     date: format(new Date(s.calculated_at), 'MMM d'),
     overall: s.overall_score || 0,
     environmental: s.environmental_score || 0,
     social: s.social_score || 0,
     governance: s.governance_score || 0,
   })) || [];
 
   const chartConfig = {
     overall: { label: 'Overall', color: 'hsl(var(--primary))' },
     environmental: { label: 'Environmental', color: 'hsl(var(--environmental))' },
     social: { label: 'Social', color: 'hsl(var(--social))' },
     governance: { label: 'Governance', color: 'hsl(var(--governance))' },
   };
 
   return (
     <DashboardLayout>
       <div className="space-y-6">
         <div>
           <h1 className="text-3xl font-bold">ESG Scores</h1>
           <p className="text-muted-foreground">Your company's ESG performance breakdown</p>
         </div>
 
         {/* Score Cards */}
         <div className="grid gap-6 md:grid-cols-4">
           <OverallScoreGauge
             score={latestScore?.overall_score ?? null}
             percentile={latestScore?.industry_percentile}
           />
           <ESGScoreCard pillar="environmental" score={latestScore?.environmental_score ?? null} size="lg" />
           <ESGScoreCard pillar="social" score={latestScore?.social_score ?? null} size="lg" />
           <ESGScoreCard pillar="governance" score={latestScore?.governance_score ?? null} size="lg" />
         </div>
 
         {/* Charts */}
         <div className="grid gap-6 md:grid-cols-2">
           <Card>
             <CardHeader>
               <CardTitle>Pillar Breakdown</CardTitle>
               <CardDescription>Compare your E, S, and G scores</CardDescription>
             </CardHeader>
             <CardContent>
               <ChartContainer config={chartConfig} className="h-[300px]">
                 <BarChart data={pillarData} layout="vertical">
                   <XAxis type="number" domain={[0, 100]} />
                   <YAxis type="category" dataKey="name" width={100} />
                   <ChartTooltip content={<ChartTooltipContent />} />
                   <Bar dataKey="score" radius={4} />
                 </BarChart>
               </ChartContainer>
             </CardContent>
           </Card>
 
           <Card>
             <CardHeader>
               <CardTitle>Score Trend</CardTitle>
               <CardDescription>Your ESG score history over time</CardDescription>
             </CardHeader>
             <CardContent>
               {trendData.length > 1 ? (
                 <ChartContainer config={chartConfig} className="h-[300px]">
                   <LineChart data={trendData}>
                     <XAxis dataKey="date" />
                     <YAxis domain={[0, 100]} />
                     <ChartTooltip content={<ChartTooltipContent />} />
                     <Line type="monotone" dataKey="overall" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                   </LineChart>
                 </ChartContainer>
               ) : (
                 <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                   Complete the questionnaire to see score trends
                 </div>
               )}
             </CardContent>
           </Card>
         </div>
       </div>
     </DashboardLayout>
   );
 }