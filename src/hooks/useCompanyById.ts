
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/lib/types';

export function useCompanyById(companyId: string | undefined) {
  const { data: company, isLoading, error } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      const { data, error } = await supabase
        .from('companies')
        .select('*, latest_score:company_scores(*)')
        .eq('id', companyId)
        .order('calculated_at', { foreignTable: 'company_scores', ascending: false })
        .limit(1, { foreignTable: 'company_scores' })
        .single();
      
      if (error) throw error;
      return data as Company | null;
    },
    enabled: !!companyId,
  });

  return { company, isLoading, error };
}
