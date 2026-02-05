 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/contexts/AuthContext';
 import { Company, IndustryType, CompanySize } from '@/lib/types';
 import { useToast } from './use-toast';
 
 export function useCompany() {
   const { user } = useAuth();
   const queryClient = useQueryClient();
   const { toast } = useToast();
 
   const { data: company, isLoading } = useQuery({
     queryKey: ['company', user?.id],
     queryFn: async () => {
       if (!user) return null;
       const { data, error } = await supabase
         .from('companies')
         .select('*')
         .eq('user_id', user.id)
         .single();
       
       if (error && error.code !== 'PGRST116') throw error;
       return data as Company | null;
     },
     enabled: !!user,
   });
 
   const createCompany = useMutation({
     mutationFn: async (data: {
       name: string;
       industry: IndustryType;
       company_size: CompanySize;
       description?: string;
       location?: string;
       revenue_range?: string;
       employee_count?: number;
       founded_year?: number;
       website?: string;
     }) => {
       if (!user) throw new Error('Not authenticated');
       const { data: newCompany, error } = await supabase
         .from('companies')
         .insert({ ...data, user_id: user.id })
         .select()
         .single();
       
       if (error) throw error;
       return newCompany;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['company', user?.id] });
       toast({ title: 'Company profile created!' });
     },
     onError: (error) => {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     },
   });
 
   const updateCompany = useMutation({
     mutationFn: async (data: Partial<Company>) => {
       if (!company) throw new Error('No company found');
       const { data: updated, error } = await supabase
         .from('companies')
         .update(data)
         .eq('id', company.id)
         .select()
         .single();
       
       if (error) throw error;
       return updated;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['company', user?.id] });
       toast({ title: 'Company profile updated!' });
     },
     onError: (error) => {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     },
   });
 
   return {
     company,
     isLoading,
     createCompany,
     updateCompany,
     hasCompany: !!company,
   };
 }