import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ESGQuestion, ESGPillar, QuestionOption } from '@/lib/types';

// This function now requires a companyId to fetch relevant questions.
export function useESGQuestions(companyId: string | undefined) {
  return useQuery({
    queryKey: ['esg-questions', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase.rpc('get_questions_for_company', {
        company_id: companyId,
      });

      if (error) throw error;
      
      // Transform the options from Json to QuestionOption[]
      return (data || []).map((q: any) => ({
        ...q,
        options: (q.options || []) as QuestionOption[],
      })) as ESGQuestion[];
    },
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