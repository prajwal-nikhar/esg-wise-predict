 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { CompanyScore } from '@/lib/types';
 import { useToast } from './use-toast';
 
 export function useCompanyScores(companyId: string | undefined) {
   const queryClient = useQueryClient();
   const { toast } = useToast();
 
   const { data: scores, isLoading } = useQuery({
     queryKey: ['company-scores', companyId],
     queryFn: async () => {
       if (!companyId) return [];
       const { data, error } = await supabase
         .from('company_scores')
         .select('*')
         .eq('company_id', companyId)
         .order('calculated_at', { ascending: false });
       
       if (error) throw error;
       return data as CompanyScore[];
     },
     enabled: !!companyId,
   });
 
   const calculateScores = useMutation({
     mutationFn: async () => {
       if (!companyId) throw new Error('No company ID');
 
       // Fetch responses and questions
       const [responsesResult, questionsResult] = await Promise.all([
         supabase.from('questionnaire_responses').select('*').eq('company_id', companyId),
         supabase.from('esg_questions').select('*').eq('is_active', true),
       ]);
 
       if (responsesResult.error) throw responsesResult.error;
       if (questionsResult.error) throw questionsResult.error;
 
       const responses = responsesResult.data;
       const questions = questionsResult.data;
 
       // Calculate pillar scores
       const pillarScores = { environmental: { total: 0, max: 0 }, social: { total: 0, max: 0 }, governance: { total: 0, max: 0 } };
 
       for (const question of questions) {
         const response = responses.find((r) => r.question_id === question.id);
         const weight = Number(question.weight);
         pillarScores[question.pillar as keyof typeof pillarScores].max += weight * 10;
         if (response?.answer === true) {
           pillarScores[question.pillar as keyof typeof pillarScores].total += weight * 10;
         }
       }
 
       const envScore = pillarScores.environmental.max > 0
         ? (pillarScores.environmental.total / pillarScores.environmental.max) * 100
         : null;
       const socScore = pillarScores.social.max > 0
         ? (pillarScores.social.total / pillarScores.social.max) * 100
         : null;
       const govScore = pillarScores.governance.max > 0
         ? (pillarScores.governance.total / pillarScores.governance.max) * 100
         : null;
 
       const validScores = [envScore, socScore, govScore].filter((s) => s !== null) as number[];
       const overallScore = validScores.length > 0
         ? validScores.reduce((a, b) => a + b, 0) / validScores.length
         : null;
 
       // Insert new score record
       const { data, error } = await supabase
         .from('company_scores')
         .insert({
           company_id: companyId,
           environmental_score: envScore,
           social_score: socScore,
           governance_score: govScore,
           overall_score: overallScore,
         })
         .select()
         .single();
 
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['company-scores', companyId] });
       toast({ title: 'Scores calculated!' });
     },
     onError: (error) => {
       toast({ title: 'Error calculating scores', description: error.message, variant: 'destructive' });
     },
   });
 
   const latestScore = scores?.[0] || null;
 
   return {
     scores,
     latestScore,
     isLoading,
     calculateScores,
   };
 }