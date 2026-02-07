import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company, CompanyScore } from '@/lib/types';

const fetchCompanyById = async (companyId: string | undefined) => {
  if (!companyId) {
    throw new Error('No company ID provided');
  }

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single();

  if (companyError) throw companyError;

  const { data: scores, error: scoresError } = await supabase
    .from('company_scores')
    .select('*')
    .eq('company_id', companyId)
    .order('calculated_at', { ascending: false });

  if (scoresError) {
    console.warn('Error fetching scores:', scoresError);
  }

  return { company: company as Company, scores: scores as CompanyScore[] };
};

export const useCompanyById = (companyId: string | undefined) => {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => fetchCompanyById(companyId),
    enabled: !!companyId,
  });
};