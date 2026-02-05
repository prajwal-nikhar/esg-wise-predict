 import { useQuery } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { ESGQuestion, ESGPillar } from '@/lib/types';
 
 export function useESGQuestions() {
   return useQuery({
     queryKey: ['esg-questions'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('esg_questions')
         .select('*')
         .eq('is_active', true)
         .order('pillar')
         .order('order_index');
       
       if (error) throw error;
       return data as ESGQuestion[];
     },
   });
 }
 
 export function useESGQuestionsByPillar() {
   const { data: questions, ...rest } = useESGQuestions();
 
   const questionsByPillar = questions?.reduce((acc, q) => {
     if (!acc[q.pillar]) acc[q.pillar] = [];
     acc[q.pillar].push(q);
     return acc;
   }, {} as Record<ESGPillar, ESGQuestion[]>);
 
   return { questionsByPillar, questions, ...rest };
 }