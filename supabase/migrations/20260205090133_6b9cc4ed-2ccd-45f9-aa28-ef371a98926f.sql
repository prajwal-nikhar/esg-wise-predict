-- Create enums for roles and industries
CREATE TYPE public.app_role AS ENUM ('company', 'investor');
CREATE TYPE public.industry_type AS ENUM (
  'technology', 'manufacturing', 'finance', 'healthcare', 
  'energy', 'retail', 'transportation', 'agriculture', 
  'construction', 'telecommunications', 'other'
);
CREATE TYPE public.company_size AS ENUM ('small', 'medium', 'large', 'enterprise');
CREATE TYPE public.esg_pillar AS ENUM ('environmental', 'social', 'governance');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table for user metadata
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  industry industry_type NOT NULL,
  company_size company_size NOT NULL DEFAULT 'medium',
  location TEXT,
  revenue_range TEXT,
  employee_count INTEGER,
  founded_year INTEGER,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- ESG Questions table
CREATE TABLE public.esg_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar esg_pillar NOT NULL,
  question_text TEXT NOT NULL,
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  category TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.esg_questions ENABLE ROW LEVEL SECURITY;

-- Questionnaire responses table
CREATE TABLE public.questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.esg_questions(id) ON DELETE CASCADE NOT NULL,
  answer BOOLEAN,
  is_predicted BOOLEAN NOT NULL DEFAULT false,
  prediction_confidence DECIMAL(3,2),
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (company_id, question_id)
);
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Company scores table
CREATE TABLE public.company_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  environmental_score DECIMAL(5,2),
  social_score DECIMAL(5,2),
  governance_score DECIMAL(5,2),
  overall_score DECIMAL(5,2),
  industry_percentile DECIMAL(5,2),
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.company_scores ENABLE ROW LEVEL SECURITY;

-- ML Predictions table for future scores
CREATE TABLE public.score_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  prediction_type TEXT NOT NULL,
  predicted_score DECIMAL(5,2),
  confidence_level DECIMAL(3,2),
  prediction_date DATE NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.score_predictions ENABLE ROW LEVEL SECURITY;

-- Investor watchlist
CREATE TABLE public.investor_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, company_id)
);
ALTER TABLE public.investor_watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User roles: users can read their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Profiles: users can manage their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Companies: owners can manage, investors can read all
CREATE POLICY "Company owners can manage their company" ON public.companies
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Investors can read all companies" ON public.companies
  FOR SELECT USING (public.has_role(auth.uid(), 'investor'));

-- ESG Questions: public read for all authenticated users
CREATE POLICY "Authenticated users can read questions" ON public.esg_questions
  FOR SELECT TO authenticated USING (true);

-- Questionnaire responses: company owners can manage, investors can read
CREATE POLICY "Company owners can manage responses" ON public.questionnaire_responses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.companies WHERE id = company_id AND user_id = auth.uid())
  );
CREATE POLICY "Investors can read all responses" ON public.questionnaire_responses
  FOR SELECT USING (public.has_role(auth.uid(), 'investor'));

-- Company scores: company owners can read own, investors can read all
CREATE POLICY "Company owners can read own scores" ON public.company_scores
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.companies WHERE id = company_id AND user_id = auth.uid())
  );
CREATE POLICY "Investors can read all scores" ON public.company_scores
  FOR SELECT USING (public.has_role(auth.uid(), 'investor'));

-- Score predictions: company owners can read own, investors can read all
CREATE POLICY "Company owners can read own predictions" ON public.score_predictions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.companies WHERE id = company_id AND user_id = auth.uid())
  );
CREATE POLICY "Investors can read all predictions" ON public.score_predictions
  FOR SELECT USING (public.has_role(auth.uid(), 'investor'));

-- Investor watchlist: investors can manage their own
CREATE POLICY "Investors can manage own watchlist" ON public.investor_watchlist
  FOR ALL USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'investor'));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default ESG questions
INSERT INTO public.esg_questions (pillar, question_text, category, weight, order_index) VALUES
-- Environmental
('environmental', 'Does your company track and report carbon emissions?', 'Carbon Emissions', 1.2, 1),
('environmental', 'Has your company set carbon reduction targets?', 'Carbon Emissions', 1.2, 2),
('environmental', 'Does your company use renewable energy sources?', 'Energy', 1.0, 3),
('environmental', 'Does your company have energy efficiency programs?', 'Energy', 0.9, 4),
('environmental', 'Does your company have waste management programs?', 'Waste Management', 1.0, 5),
('environmental', 'Does your company have recycling initiatives?', 'Waste Management', 0.9, 6),
('environmental', 'Does your company have water conservation measures?', 'Water Conservation', 1.0, 7),
('environmental', 'Does your company monitor water usage?', 'Water Conservation', 0.8, 8),
('environmental', 'Does your company have environmental compliance certifications?', 'Compliance', 1.1, 9),
('environmental', 'Does your company conduct environmental impact assessments?', 'Compliance', 1.0, 10),
-- Social
('social', 'Does your company have diversity and inclusion policies?', 'Diversity & Inclusion', 1.2, 1),
('social', 'Does your company track diversity metrics?', 'Diversity & Inclusion', 1.0, 2),
('social', 'Does your company have employee health and safety programs?', 'Health & Safety', 1.2, 3),
('social', 'Does your company provide mental health support?', 'Health & Safety', 1.0, 4),
('social', 'Does your company engage in community initiatives?', 'Community', 0.9, 5),
('social', 'Does your company support local suppliers?', 'Community', 0.8, 6),
('social', 'Does your company ensure fair labor practices?', 'Labor', 1.2, 7),
('social', 'Does your company have equal pay policies?', 'Labor', 1.1, 8),
('social', 'Does your company have data privacy protection measures?', 'Privacy', 1.1, 9),
('social', 'Does your company provide employee training programs?', 'Development', 0.9, 10),
-- Governance
('governance', 'Does your company have an independent board of directors?', 'Board', 1.2, 1),
('governance', 'Does your board have diverse representation?', 'Board', 1.1, 2),
('governance', 'Does your company disclose executive compensation?', 'Compensation', 1.0, 3),
('governance', 'Does your company have performance-linked executive pay?', 'Compensation', 0.9, 4),
('governance', 'Does your company have anti-corruption policies?', 'Ethics', 1.2, 5),
('governance', 'Does your company conduct ethics training?', 'Ethics', 1.0, 6),
('governance', 'Does your company have whistleblower protection?', 'Transparency', 1.1, 7),
('governance', 'Does your company publish sustainability reports?', 'Transparency', 1.0, 8),
('governance', 'Does your company have formal risk management processes?', 'Risk Management', 1.1, 9),
('governance', 'Does your company have cybersecurity policies?', 'Risk Management', 1.0, 10);