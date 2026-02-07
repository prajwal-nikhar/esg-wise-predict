 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { QuestionnaireResponse } from '@/lib/types';
 import { useToast } from './use-toast';
 
 export function useQuestionnaireResponses(companyId: string | undefined) {
   const queryClient = useQueryClient();
   const { toast } = useToast();
 
   const { data: responses, isLoading } = useQuery({
     queryKey: ['questionnaire-responses', companyId],
     queryFn: async () => {
       if (!companyId) return [];
       const { data, error } = await supabase
         .from('questionnaire_responses')
         .select('*')
         .eq('company_id', companyId);
       
       if (error) throw error;
       return data as QuestionnaireResponse[];
     },
     enabled: !!companyId,
   });
 
  const upsertResponse = useMutation({
    mutationFn: async ({ questionId, selectedOptionId }: { questionId: string; selectedOptionId: string }) => {
      if (!companyId) throw new Error('No company ID');
      
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .upsert(
          {
            company_id: companyId,
            question_id: questionId,
            selected_option_id: selectedOptionId,
            is_predicted: false,
            answered_at: new Date().toISOString(),
          },
          { onConflict: 'company_id,question_id' }
        )
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['questionnaire-responses', companyId] });
     },
     onError: (error) => {
       toast({ title: 'Error saving response', description: error.message, variant: 'destructive' });
     },
   });
 
   const responsesMap = responses?.reduce((acc, r) => {
     acc[r.question_id] = r;
     return acc;
   }, {} as Record<string, QuestionnaireResponse>);
 
   return {
     responses,
     responsesMap,
     isLoading,
     upsertResponse,
   };
 }