CREATE OR REPLACE FUNCTION public.get_questions_for_company(p_company_id UUID)
RETURNS SETOF public.esg_questions
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_company_industry public.industry_type;
BEGIN
  -- Get the industry of the specified company
  SELECT industry INTO v_company_industry
  FROM public.companies
  WHERE id = p_company_id;

  -- Return all questions for that industry
  RETURN QUERY
  SELECT *
  FROM public.esg_questions
  WHERE esg_questions.industry = v_company_industry
  ORDER BY esg_questions.pillar, esg_questions.order_index;
END;
$$;