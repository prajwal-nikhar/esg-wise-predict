 import { useQuery } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { Company, CompanyScore, IndustryType } from '@/lib/types';
 
 interface CompanyWithScore extends Company {
   latest_score?: CompanyScore | null;
 }
 
 export function useCompanies(filters?: { industry?: IndustryType; minScore?: number; search?: string }) {
   return useQuery({
     queryKey: ['companies', filters],
     queryFn: async () => {
       let query = supabase.from('companies').select('*');
 
       if (filters?.industry) {
         query = query.eq('industry', filters.industry);
       }
       if (filters?.search) {
         query = query.ilike('name', `%${filters.search}%`);
       }
 
       const { data: companies, error } = await query;
       if (error) throw error;
 
       // Fetch latest scores for each company
       const companyIds = companies.map((c) => c.id);
       const { data: scores } = await supabase
         .from('company_scores')
         .select('*')
         .in('company_id', companyIds)
         .order('calculated_at', { ascending: false });
 
       // Map scores to companies
       const companiesWithScores: CompanyWithScore[] = companies.map((company) => {
         const companyScores = scores?.filter((s) => s.company_id === company.id) || [];
         const latestScore = companyScores[0] || null;
 
         // Apply score filter
         if (filters?.minScore && (!latestScore || (latestScore.overall_score ?? 0) < filters.minScore)) {
           return null;
         }
 
         return {
           ...company,
           latest_score: latestScore,
         } as CompanyWithScore;
       }).filter(Boolean) as CompanyWithScore[];
 
       return companiesWithScores;
     },
   });
 }
 
 export function useCompanyById(companyId: string | undefined) {
   return useQuery({
     queryKey: ['company-detail', companyId],
     queryFn: async () => {
       if (!companyId) return null;
       
       const [companyResult, scoresResult, responsesResult] = await Promise.all([
         supabase.from('companies').select('*').eq('id', companyId).single(),
         supabase.from('company_scores').select('*').eq('company_id', companyId).order('calculated_at', { ascending: false }),
         supabase.from('questionnaire_responses').select('*, esg_questions(*)').eq('company_id', companyId),
       ]);
 
       if (companyResult.error) throw companyResult.error;
 
       return {
         company: companyResult.data as Company,
         scores: scoresResult.data || [],
         responses: responsesResult.data || [],
       };
     },
     enabled: !!companyId,
   });
 }