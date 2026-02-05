 import { useState } from 'react';
 import { DashboardLayout } from '@/components/layout/DashboardLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { useCompanies } from '@/hooks/useCompanies';
 import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
 import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
 import { Loader2, Plus, X } from 'lucide-react';
 
 export default function CompareCompanies() {
   const { data: companies, isLoading } = useCompanies();
   const [selectedIds, setSelectedIds] = useState<string[]>([]);
 
   const selectedCompanies = companies?.filter((c) => selectedIds.includes(c.id)) || [];
 
   const addCompany = (id: string) => {
     if (!selectedIds.includes(id) && selectedIds.length < 5) {
       setSelectedIds([...selectedIds, id]);
     }
   };
 
   const removeCompany = (id: string) => {
     setSelectedIds(selectedIds.filter((i) => i !== id));
   };
 
   const barData = selectedCompanies.map((c) => ({
     name: c.name,
     overall: c.latest_score?.overall_score || 0,
   }));
 
   const radarData = [
     { subject: 'Environmental', ...Object.fromEntries(selectedCompanies.map((c) => [c.name, c.latest_score?.environmental_score || 0])) },
     { subject: 'Social', ...Object.fromEntries(selectedCompanies.map((c) => [c.name, c.latest_score?.social_score || 0])) },
     { subject: 'Governance', ...Object.fromEntries(selectedCompanies.map((c) => [c.name, c.latest_score?.governance_score || 0])) },
   ];
 
   const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
 
   const chartConfig = Object.fromEntries(
     selectedCompanies.map((c, i) => [c.name, { label: c.name, color: colors[i] }])
   );
 
   if (isLoading) {
     return (
       <DashboardLayout>
         <div className="flex items-center justify-center min-h-[60vh]">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
       </DashboardLayout>
     );
   }
 
   const availableCompanies = companies?.filter(
     (c) => !selectedIds.includes(c.id) && c.latest_score?.overall_score
   );
 
   return (
     <DashboardLayout>
       <div className="space-y-6">
         <div>
           <h1 className="text-3xl font-bold">Compare Companies</h1>
           <p className="text-muted-foreground">Side-by-side ESG score comparison</p>
         </div>
 
         {/* Selection */}
         <Card>
           <CardHeader>
             <CardTitle>Select Companies</CardTitle>
             <CardDescription>Choose up to 5 companies to compare</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex flex-wrap gap-2">
               {selectedCompanies.map((c, i) => (
                 <div
                   key={c.id}
                   className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                   style={{ borderColor: colors[i] }}
                 >
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                   <span className="text-sm font-medium">{c.name}</span>
                   <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeCompany(c.id)}>
                     <X className="h-3 w-3" />
                   </Button>
                 </div>
               ))}
             </div>
             {selectedIds.length < 5 && availableCompanies && availableCompanies.length > 0 && (
               <Select onValueChange={addCompany}>
                 <SelectTrigger className="w-full md:w-[300px]">
                   <SelectValue placeholder="Add company to compare..." />
                 </SelectTrigger>
                 <SelectContent>
                   {availableCompanies.map((c) => (
                     <SelectItem key={c.id} value={c.id}>
                       {c.name} ({c.latest_score?.overall_score?.toFixed(0) || 'N/A'})
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             )}
           </CardContent>
         </Card>
 
         {selectedCompanies.length >= 2 && (
           <div className="grid gap-6 md:grid-cols-2">
             {/* Overall Score Comparison */}
             <Card>
               <CardHeader>
                 <CardTitle>Overall ESG Scores</CardTitle>
               </CardHeader>
               <CardContent>
                 <ChartContainer config={chartConfig} className="h-[300px]">
                   <BarChart data={barData}>
                     <XAxis dataKey="name" />
                     <YAxis domain={[0, 100]} />
                     <ChartTooltip content={<ChartTooltipContent />} />
                     <Bar dataKey="overall" radius={4}>
                       {barData.map((_, index) => (
                         <rect key={index} fill={colors[index]} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ChartContainer>
               </CardContent>
             </Card>
 
             {/* Radar Chart */}
             <Card>
               <CardHeader>
                 <CardTitle>Pillar Breakdown</CardTitle>
               </CardHeader>
               <CardContent>
                 <ChartContainer config={chartConfig} className="h-[300px]">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                     <PolarGrid />
                     <PolarAngleAxis dataKey="subject" />
                     <PolarRadiusAxis domain={[0, 100]} />
                     {selectedCompanies.map((c, i) => (
                       <Radar
                         key={c.id}
                         name={c.name}
                         dataKey={c.name}
                         stroke={colors[i]}
                         fill={colors[i]}
                         fillOpacity={0.2}
                       />
                     ))}
                     <Legend />
                   </RadarChart>
                 </ChartContainer>
               </CardContent>
             </Card>
           </div>
         )}
 
         {/* Detailed Comparison Table */}
         {selectedCompanies.length >= 2 && (
           <Card>
             <CardHeader>
               <CardTitle>Detailed Comparison</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="border-b">
                       <th className="text-left p-2">Metric</th>
                       {selectedCompanies.map((c, i) => (
                         <th key={c.id} className="text-center p-2" style={{ color: colors[i] }}>
                           {c.name}
                         </th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b">
                       <td className="p-2 font-medium">Overall Score</td>
                       {selectedCompanies.map((c) => (
                         <td key={c.id} className="text-center p-2">{c.latest_score?.overall_score?.toFixed(1) || '—'}</td>
                       ))}
                     </tr>
                     <tr className="border-b">
                       <td className="p-2 font-medium">Environmental</td>
                       {selectedCompanies.map((c) => (
                         <td key={c.id} className="text-center p-2 text-environmental">{c.latest_score?.environmental_score?.toFixed(1) || '—'}</td>
                       ))}
                     </tr>
                     <tr className="border-b">
                       <td className="p-2 font-medium">Social</td>
                       {selectedCompanies.map((c) => (
                         <td key={c.id} className="text-center p-2 text-social">{c.latest_score?.social_score?.toFixed(1) || '—'}</td>
                       ))}
                     </tr>
                     <tr>
                       <td className="p-2 font-medium">Governance</td>
                       {selectedCompanies.map((c) => (
                         <td key={c.id} className="text-center p-2 text-governance">{c.latest_score?.governance_score?.toFixed(1) || '—'}</td>
                       ))}
                     </tr>
                   </tbody>
                 </table>
               </div>
             </CardContent>
           </Card>
         )}
 
         {selectedCompanies.length < 2 && (
           <Card>
             <CardContent className="py-12 text-center text-muted-foreground">
               Select at least 2 companies to start comparing
             </CardContent>
           </Card>
         )}
       </div>
     </DashboardLayout>
   );
 }