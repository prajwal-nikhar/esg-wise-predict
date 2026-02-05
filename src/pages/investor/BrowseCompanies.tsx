 import { useState } from 'react';
 import { DashboardLayout } from '@/components/layout/DashboardLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { useCompanies } from '@/hooks/useCompanies';
 import { useWatchlist } from '@/hooks/useWatchlist';
 import { IndustryType, INDUSTRY_LABELS } from '@/lib/types';
 import { Search, Star, StarOff, Building2, Loader2 } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 
 export default function BrowseCompanies() {
   const navigate = useNavigate();
   const [search, setSearch] = useState('');
   const [industry, setIndustry] = useState<IndustryType | 'all'>('all');
   const [minScore, setMinScore] = useState<number | undefined>();
 
   const { data: companies, isLoading } = useCompanies({
     industry: industry === 'all' ? undefined : industry,
     search: search || undefined,
     minScore,
   });
   const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
 
   const getScoreColor = (score: number | null | undefined) => {
     if (!score) return 'bg-muted text-muted-foreground';
     if (score >= 80) return 'bg-score-excellent text-white';
     if (score >= 60) return 'bg-score-good text-white';
     if (score >= 40) return 'bg-score-average text-white';
     return 'bg-score-poor text-white';
   };
 
   return (
     <DashboardLayout>
       <div className="space-y-6">
         <div>
           <h1 className="text-3xl font-bold">Browse Companies</h1>
           <p className="text-muted-foreground">Search and filter companies by ESG performance</p>
         </div>
 
         {/* Filters */}
         <Card>
           <CardContent className="pt-6">
             <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1 relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   placeholder="Search companies..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-10"
                 />
               </div>
               <Select value={industry} onValueChange={(v) => setIndustry(v as IndustryType | 'all')}>
                 <SelectTrigger className="w-full md:w-[200px]">
                   <SelectValue placeholder="All Industries" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Industries</SelectItem>
                   {Object.entries(INDUSTRY_LABELS).map(([value, label]) => (
                     <SelectItem key={value} value={value}>
                       {label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
               <Select
                 value={minScore?.toString() || 'any'}
                 onValueChange={(v) => setMinScore(v === 'any' ? undefined : parseInt(v))}
               >
                 <SelectTrigger className="w-full md:w-[180px]">
                   <SelectValue placeholder="Min Score" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="any">Any Score</SelectItem>
                   <SelectItem value="80">80+ (Excellent)</SelectItem>
                   <SelectItem value="60">60+ (Good)</SelectItem>
                   <SelectItem value="40">40+ (Average)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </CardContent>
         </Card>
 
         {/* Results */}
         {isLoading ? (
           <div className="flex items-center justify-center py-12">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
         ) : (
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {companies?.map((company) => {
               const inWatchlist = isInWatchlist(company.id);
               return (
                 <Card key={company.id} className="hover:shadow-md transition-shadow">
                   <CardHeader className="pb-3">
                     <div className="flex items-start justify-between">
                       <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-muted">
                           <Building2 className="h-5 w-5 text-muted-foreground" />
                         </div>
                         <div>
                           <CardTitle className="text-lg">{company.name}</CardTitle>
                           <CardDescription>{INDUSTRY_LABELS[company.industry]}</CardDescription>
                         </div>
                       </div>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={(e) => {
                           e.stopPropagation();
                           inWatchlist
                             ? removeFromWatchlist.mutate(company.id)
                             : addToWatchlist.mutate(company.id);
                         }}
                       >
                         {inWatchlist ? (
                           <Star className="h-5 w-5 fill-primary text-primary" />
                         ) : (
                           <StarOff className="h-5 w-5" />
                         )}
                       </Button>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-3">
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-muted-foreground">ESG Score</span>
                       <Badge className={getScoreColor(company.latest_score?.overall_score)}>
                         {company.latest_score?.overall_score?.toFixed(0) || 'N/A'}
                       </Badge>
                     </div>
                     <div className="grid grid-cols-3 gap-2 text-center text-xs">
                       <div className="p-2 rounded bg-environmental/10">
                         <span className="text-muted-foreground">E</span>
                         <p className="font-bold text-environmental">
                           {company.latest_score?.environmental_score?.toFixed(0) || '—'}
                         </p>
                       </div>
                       <div className="p-2 rounded bg-social/10">
                         <span className="text-muted-foreground">S</span>
                         <p className="font-bold text-social">
                           {company.latest_score?.social_score?.toFixed(0) || '—'}
                         </p>
                       </div>
                       <div className="p-2 rounded bg-governance/10">
                         <span className="text-muted-foreground">G</span>
                         <p className="font-bold text-governance">
                           {company.latest_score?.governance_score?.toFixed(0) || '—'}
                         </p>
                       </div>
                     </div>
                     <Button variant="outline" className="w-full" onClick={() => navigate(`/investor/company/${company.id}`)}>
                       View Details
                     </Button>
                   </CardContent>
                 </Card>
               );
             })}
             {companies?.length === 0 && (
               <div className="col-span-full text-center py-12 text-muted-foreground">
                 No companies found matching your criteria
               </div>
             )}
           </div>
         )}
       </div>
     </DashboardLayout>
   );
 }