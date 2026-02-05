 import { DashboardLayout } from '@/components/layout/DashboardLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { useCompanies } from '@/hooks/useCompanies';
 import { useWatchlist } from '@/hooks/useWatchlist';
 import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
 import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
 import { Search, GitCompare, Star, Building2, Loader2 } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 
 export default function InvestorDashboard() {
   const navigate = useNavigate();
   const { data: companies, isLoading } = useCompanies();
   const { watchlist } = useWatchlist();
 
   if (isLoading) {
     return (
       <DashboardLayout>
         <div className="flex items-center justify-center min-h-[60vh]">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
       </DashboardLayout>
     );
   }
 
   const companiesWithScores = companies?.filter((c) => c.latest_score?.overall_score) || [];
   const avgScore = companiesWithScores.length > 0
     ? companiesWithScores.reduce((acc, c) => acc + (c.latest_score?.overall_score || 0), 0) / companiesWithScores.length
     : 0;
 
   const scoreDistribution = [
     { name: 'Excellent (80+)', value: companiesWithScores.filter((c) => (c.latest_score?.overall_score ?? 0) >= 80).length, fill: 'hsl(var(--score-excellent))' },
     { name: 'Good (60-79)', value: companiesWithScores.filter((c) => (c.latest_score?.overall_score ?? 0) >= 60 && (c.latest_score?.overall_score ?? 0) < 80).length, fill: 'hsl(var(--score-good))' },
     { name: 'Average (40-59)', value: companiesWithScores.filter((c) => (c.latest_score?.overall_score ?? 0) >= 40 && (c.latest_score?.overall_score ?? 0) < 60).length, fill: 'hsl(var(--score-average))' },
     { name: 'Below (< 40)', value: companiesWithScores.filter((c) => (c.latest_score?.overall_score ?? 0) < 40).length, fill: 'hsl(var(--score-poor))' },
   ];
 
   const chartConfig = {
     excellent: { label: 'Excellent', color: 'hsl(var(--score-excellent))' },
     good: { label: 'Good', color: 'hsl(var(--score-good))' },
     average: { label: 'Average', color: 'hsl(var(--score-average))' },
     poor: { label: 'Below Average', color: 'hsl(var(--score-poor))' },
   };
 
   return (
     <DashboardLayout>
       <div className="space-y-6">
         <div>
           <h1 className="text-3xl font-bold">Investor Dashboard</h1>
           <p className="text-muted-foreground">ESG analytics and company insights</p>
         </div>
 
         {/* Stats */}
         <div className="grid gap-4 md:grid-cols-4">
           <Card>
             <CardHeader className="pb-2">
               <CardDescription>Total Companies</CardDescription>
               <CardTitle className="text-3xl">{companies?.length || 0}</CardTitle>
             </CardHeader>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardDescription>With ESG Scores</CardDescription>
               <CardTitle className="text-3xl">{companiesWithScores.length}</CardTitle>
             </CardHeader>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardDescription>Average Score</CardDescription>
               <CardTitle className="text-3xl">{avgScore.toFixed(0)}</CardTitle>
             </CardHeader>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardDescription>Watchlist</CardDescription>
               <CardTitle className="text-3xl">{watchlist?.length || 0}</CardTitle>
             </CardHeader>
           </Card>
         </div>
 
         <div className="grid gap-6 md:grid-cols-2">
           {/* Score Distribution */}
           <Card>
             <CardHeader>
               <CardTitle>Score Distribution</CardTitle>
               <CardDescription>Companies by ESG score range</CardDescription>
             </CardHeader>
             <CardContent>
               <ChartContainer config={chartConfig} className="h-[250px]">
                 <PieChart>
                   <Pie
                     data={scoreDistribution}
                     dataKey="value"
                     nameKey="name"
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={2}
                   >
                     {scoreDistribution.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.fill} />
                     ))}
                   </Pie>
                   <ChartTooltip content={<ChartTooltipContent />} />
                 </PieChart>
               </ChartContainer>
               <div className="flex flex-wrap justify-center gap-4 mt-4">
                 {scoreDistribution.map((item) => (
                   <div key={item.name} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                     <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
 
           {/* Quick Actions */}
           <div className="space-y-4">
             <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/investor/browse')}>
               <CardHeader className="flex flex-row items-center gap-4">
                 <div className="p-2 rounded-lg bg-primary/10">
                   <Search className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                   <CardTitle className="text-lg">Browse Companies</CardTitle>
                   <CardDescription>Search and filter companies by ESG scores</CardDescription>
                 </div>
               </CardHeader>
             </Card>
             <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/investor/compare')}>
               <CardHeader className="flex flex-row items-center gap-4">
                 <div className="p-2 rounded-lg bg-primary/10">
                   <GitCompare className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                   <CardTitle className="text-lg">Compare Companies</CardTitle>
                   <CardDescription>Side-by-side ESG score comparison</CardDescription>
                 </div>
               </CardHeader>
             </Card>
             <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/investor/watchlist')}>
               <CardHeader className="flex flex-row items-center gap-4">
                 <div className="p-2 rounded-lg bg-primary/10">
                   <Star className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                   <CardTitle className="text-lg">My Watchlist</CardTitle>
                   <CardDescription>Track companies you're interested in</CardDescription>
                 </div>
               </CardHeader>
             </Card>
           </div>
         </div>
       </div>
     </DashboardLayout>
   );
 }