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

      // Fetch company to get industry
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('industry')
        .eq('id', companyId)
        .single();
      
      if (companyError) throw companyError;

      // Fetch responses, questions with options, and pillar weights
      const [responsesResult, questionsResult, optionsResult, weightsResult] = await Promise.all([
        supabase.from('questionnaire_responses').select('*').eq('company_id', companyId),
        supabase.from('esg_questions').select('*').eq('industry', company.industry),
        supabase.from('question_options').select('*'),
        supabase.from('pillar_weights').select('*').eq('industry', company.industry).single(),
      ]);

      if (responsesResult.error) throw responsesResult.error;
      if (questionsResult.error) throw questionsResult.error;
      if (optionsResult.error) throw optionsResult.error;

      const responses = responsesResult.data;
      const questions = questionsResult.data;
      const options = optionsResult.data;
      const weights = weightsResult.data;

      // Calculate pillar scores based on selected options
      const pillarScores = { environmental: { total: 0, count: 0 }, social: { total: 0, count: 0 }, governance: { total: 0, count: 0 } };

      for (const question of questions) {
        const response = responses.find((r) => r.question_id === question.id);
        if (response?.selected_option_id) {
          const selectedOption = options.find((o) => o.id === response.selected_option_id);
          if (selectedOption) {
            const pillar = question.pillar as keyof typeof pillarScores;
            pillarScores[pillar].total += selectedOption.score;
            pillarScores[pillar].count += 1;
          }
        }
      }

      // Calculate average scores per pillar (0-100 scale, assuming options score 0-100)
      const envScore = pillarScores.environmental.count > 0
        ? pillarScores.environmental.total / pillarScores.environmental.count
        : null;
      const socScore = pillarScores.social.count > 0
        ? pillarScores.social.total / pillarScores.social.count
        : null;
      const govScore = pillarScores.governance.count > 0
        ? pillarScores.governance.total / pillarScores.governance.count
        : null;

      // Calculate weighted overall score using industry weights
      let overallScore: number | null = null;
      if (weights && (envScore !== null || socScore !== null || govScore !== null)) {
        const envWeight = Number(weights.environmental_weight) || 0.33;
        const socWeight = Number(weights.social_weight) || 0.33;
        const govWeight = Number(weights.governance_weight) || 0.34;
        
        let weightedSum = 0;
        let totalWeight = 0;
        
        if (envScore !== null) { weightedSum += envScore * envWeight; totalWeight += envWeight; }
        if (socScore !== null) { weightedSum += socScore * socWeight; totalWeight += socWeight; }
        if (govScore !== null) { weightedSum += govScore * govWeight; totalWeight += govWeight; }
        
        overallScore = totalWeight > 0 ? weightedSum / totalWeight : null;
      } else {
        const validScores = [envScore, socScore, govScore].filter((s) => s !== null) as number[];
        overallScore = validScores.length > 0
          ? validScores.reduce((a, b) => a + b, 0) / validScores.length
          : null;
      }
 
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