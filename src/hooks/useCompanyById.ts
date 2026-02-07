import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Company, CompanyScore } from '@/lib/types';

export interface CompanyDetailsData extends Company {
  latest_score: CompanyScore | null;
}

export const useCompanyById = (companyId: string | undefined) => {
  const [companyData, setCompanyData] = useState<CompanyDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) {
        setCompanyData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();

        if (companyError) throw companyError;
        if (!company) throw new Error('Company not found.');

        const { data: latestScoreData, error: scoreError } = await supabase
          .from('company_scores')
          .select('*')
          .eq('company_id', companyId)
          .order('calculated_at', { ascending: false })
          .limit(1);

        if (scoreError) {
          console.warn(scoreError);
        }

        const score = latestScoreData && latestScoreData.length > 0 ? latestScoreData[0] : null;

        setCompanyData({ ...company, latest_score: score });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  return { companyData, loading, error };
};