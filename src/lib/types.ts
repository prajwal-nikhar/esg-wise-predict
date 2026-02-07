 export type AppRole = 'company' | 'investor';
 export type IndustryType = 'technology' | 'manufacturing' | 'finance' | 'healthcare' | 'energy' | 'retail' | 'transportation' | 'agriculture' | 'construction' | 'telecommunications' | 'other';
 export type CompanySize = 'small' | 'medium' | 'large' | 'enterprise';
 export type ESGPillar = 'environmental' | 'social' | 'governance';
 
 export interface Profile {
   id: string;
   user_id: string;
   full_name: string | null;
   avatar_url: string | null;
   created_at: string;
   updated_at: string;
 }
 
 export interface UserRole {
   id: string;
   user_id: string;
   role: AppRole;
   created_at: string;
 }
 
 export interface Company {
   id: string;
   user_id: string;
   name: string;
   description: string | null;
   industry: IndustryType;
   company_size: CompanySize;
   location: string | null;
   revenue_range: string | null;
   employee_count: number | null;
   founded_year: number | null;
   website: string | null;
   created_at: string;
   updated_at: string;
 }
 
export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  score: number;
  order_index: number;
}

export interface ESGQuestion {
  id: string;
  pillar: ESGPillar;
  question_text: string;
  category: string;
  order_index: number;
  industry: IndustryType;
  created_at: string;
  options?: QuestionOption[];
}

export interface QuestionnaireResponse {
  id: string;
  company_id: string;
  question_id: string;
  selected_option_id: string | null;
  is_predicted: boolean;
  prediction_confidence: number | null;
  answered_at: string;
}
 
 export interface CompanyScore {
   id: string;
   company_id: string;
   environmental_score: number | null;
   social_score: number | null;
   governance_score: number | null;
   overall_score: number | null;
   industry_percentile: number | null;
   calculated_at: string;
 }
 
 export interface ScorePrediction {
   id: string;
   company_id: string;
   prediction_type: string;
   predicted_score: number | null;
   confidence_level: number | null;
   prediction_date: string;
   details: Record<string, unknown> | null;
   created_at: string;
 }
 
 export interface InvestorWatchlist {
   id: string;
   user_id: string;
   company_id: string;
   notes: string | null;
   created_at: string;
 }
 
 export const INDUSTRY_LABELS: Record<IndustryType, string> = {
   technology: 'Technology',
   manufacturing: 'Manufacturing',
   finance: 'Finance',
   healthcare: 'Healthcare',
   energy: 'Energy',
   retail: 'Retail',
   transportation: 'Transportation',
   agriculture: 'Agriculture',
   construction: 'Construction',
   telecommunications: 'Telecommunications',
   other: 'Other',
 };
 
 export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
   small: 'Small (1-50 employees)',
   medium: 'Medium (51-250 employees)',
   large: 'Large (251-1000 employees)',
   enterprise: 'Enterprise (1000+ employees)',
 };
 
 export const PILLAR_LABELS: Record<ESGPillar, string> = {
   environmental: 'Environmental',
   social: 'Social',
   governance: 'Governance',
 };

 export const PILLAR_COLORS: Record<ESGPillar, string> = {
  environmental: '#22c55e',
  social: '#3b82f6',
  governance: '#8b5cf6',
};

export interface ESGNews {
  title: string;
  link: string;
  source: string;
  published_date: Date | null;
}
