 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/contexts/AuthContext';
 import { InvestorWatchlist, Company, CompanyScore } from '@/lib/types';
 import { useToast } from './use-toast';
 
 interface WatchlistItem extends InvestorWatchlist {
   company?: Company;
   latest_score?: CompanyScore | null;
 }
 
 export function useWatchlist() {
   const { user } = useAuth();
   const queryClient = useQueryClient();
   const { toast } = useToast();
 
   const { data: watchlist, isLoading } = useQuery({
     queryKey: ['watchlist', user?.id],
     queryFn: async () => {
       if (!user) return [];
       
       const { data: items, error } = await supabase
         .from('investor_watchlist')
         .select('*')
         .eq('user_id', user.id);
       
       if (error) throw error;
 
       // Fetch company details
       const companyIds = items.map((i) => i.company_id);
       const [companiesResult, scoresResult] = await Promise.all([
         supabase.from('companies').select('*').in('id', companyIds),
         supabase.from('company_scores').select('*').in('company_id', companyIds).order('calculated_at', { ascending: false }),
       ]);
 
       return items.map((item) => ({
         ...item,
         company: companiesResult.data?.find((c) => c.id === item.company_id),
         latest_score: scoresResult.data?.find((s) => s.company_id === item.company_id),
       })) as WatchlistItem[];
     },
     enabled: !!user,
   });
 
   const addToWatchlist = useMutation({
     mutationFn: async (companyId: string) => {
       if (!user) throw new Error('Not authenticated');
       const { error } = await supabase.from('investor_watchlist').insert({
         user_id: user.id,
         company_id: companyId,
       });
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] });
       toast({ title: 'Added to watchlist' });
     },
     onError: (error) => {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     },
   });
 
   const removeFromWatchlist = useMutation({
     mutationFn: async (companyId: string) => {
       if (!user) throw new Error('Not authenticated');
       const { error } = await supabase
         .from('investor_watchlist')
         .delete()
         .eq('user_id', user.id)
         .eq('company_id', companyId);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] });
       toast({ title: 'Removed from watchlist' });
     },
     onError: (error) => {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     },
   });
 
   const isInWatchlist = (companyId: string) => {
     return watchlist?.some((w) => w.company_id === companyId) || false;
   };
 
   return {
     watchlist,
     isLoading,
     addToWatchlist,
     removeFromWatchlist,
     isInWatchlist,
   };
 }