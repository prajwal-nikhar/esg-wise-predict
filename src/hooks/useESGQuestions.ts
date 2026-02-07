import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ESGQuestion, ESGPillar } from '@/lib/types';

// This function now requires a companyId to fetch relevant questions.
export function useESGQuestions(companyId: string) {
  return useQuery({
    queryKey: ['esg-questions', companyId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_questions_for_company', {
        p_company_id: companyId,
      });

      if (error) throw error;
      return data as ESGQuestion[];
    },
    // The query will not run until the companyId is available.
    enabled: !!companyId,
  });
}

export function useESGQuestionsByPillar(companyId: string) {
  const { data: questions, ...rest } = useESGQuestions(companyId);

  const questionsByPillar = questions?.reduce((acc, q) => {
    if (!acc[q.pillar]) acc[q.pillar] = [];
    acc[q.pillar].push(q);
    return acc;
  }, {} as Record<ESGPillar, ESGQuestion[]>);

  return { questionsByPillar, questions, ...rest };
}