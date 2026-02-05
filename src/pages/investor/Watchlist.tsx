 import { DashboardLayout } from '@/components/layout/DashboardLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { useWatchlist } from '@/hooks/useWatchlist';
 import { INDUSTRY_LABELS } from '@/lib/types';
 import { Star, Building2, Loader2, Trash2 } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 
 export default function Watchlist() {
   const navigate = useNavigate();
   const { watchlist, isLoading, removeFromWatchlist } = useWatchlist();
 
   const getScoreColor = (score: number | null | undefined) => {
     if (!score) return 'bg-muted text-muted-foreground';
     if (score >= 80) return 'bg-score-excellent text-white';
     if (score >= 60) return 'bg-score-good text-white';
     if (score >= 40) return 'bg-score-average text-white';
     return 'bg-score-poor text-white';
   };
 
   if (isLoading) {
     return (
       <DashboardLayout>
         <div className="flex items-center justify-center min-h-[60vh]">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
       </DashboardLayout>
     );
   }
 
   return (
     <DashboardLayout>
       <div className="space-y-6">
         <div className="flex items-center gap-3">
           <Star className="h-8 w-8 text-primary fill-primary" />
           <div>
             <h1 className="text-3xl font-bold">My Watchlist</h1>
             <p className="text-muted-foreground">Companies you're tracking</p>
           </div>
         </div>
 
         {watchlist && watchlist.length > 0 ? (
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {watchlist.map((item) => (
               <Card key={item.id} className="hover:shadow-md transition-shadow">
                 <CardHeader className="pb-3">
                   <div className="flex items-start justify-between">
                     <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-muted">
                         <Building2 className="h-5 w-5 text-muted-foreground" />
                       </div>
                       <div>
                         <CardTitle className="text-lg">{item.company?.name}</CardTitle>
                         <CardDescription>
                           {item.company?.industry ? INDUSTRY_LABELS[item.company.industry] : '—'}
                         </CardDescription>
                       </div>
                     </div>
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={() => removeFromWatchlist.mutate(item.company_id)}
                     >
                       <Trash2 className="h-4 w-4 text-destructive" />
                     </Button>
                   </div>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">ESG Score</span>
                     <Badge className={getScoreColor(item.latest_score?.overall_score)}>
                       {item.latest_score?.overall_score?.toFixed(0) || 'N/A'}
                     </Badge>
                   </div>
                   <div className="grid grid-cols-3 gap-2 text-center text-xs">
                     <div className="p-2 rounded bg-environmental/10">
                       <span className="text-muted-foreground">E</span>
                       <p className="font-bold text-environmental">
                         {item.latest_score?.environmental_score?.toFixed(0) || '—'}
                       </p>
                     </div>
                     <div className="p-2 rounded bg-social/10">
                       <span className="text-muted-foreground">S</span>
                       <p className="font-bold text-social">
                         {item.latest_score?.social_score?.toFixed(0) || '—'}
                       </p>
                     </div>
                     <div className="p-2 rounded bg-governance/10">
                       <span className="text-muted-foreground">G</span>
                       <p className="font-bold text-governance">
                         {item.latest_score?.governance_score?.toFixed(0) || '—'}
                       </p>
                     </div>
                   </div>
                   <Button variant="outline" className="w-full" onClick={() => navigate(`/investor/company/${item.company_id}`)}>
                     View Details
                   </Button>
                 </CardContent>
               </Card>
             ))}
           </div>
         ) : (
           <Card>
             <CardContent className="py-12 text-center">
               <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
               <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
               <Button onClick={() => navigate('/investor/browse')}>Browse Companies</Button>
             </CardContent>
           </Card>
         )}
       </div>
     </DashboardLayout>
   );
 }