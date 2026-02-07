CREATE OR REPLACE FUNCTION public.get_questions_for_company(company_id uuid)
 RETURNS TABLE(id uuid, pillar esg_pillar, question_text text, category text, order_index integer, industry industry_type, created_at timestamp with time zone, options jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
  company_industry_value industry_type;
BEGIN
  -- First, get the company's industry into a variable
  SELECT c.industry INTO company_industry_value
  FROM public.companies c
  WHERE c.id = get_questions_for_company.company_id;

  RETURN QUERY
  SELECT
    q.id,
    q.pillar,
    q.question_text,
    q.category,
    q.order_index,
    q.industry,
    q.created_at,
    (
      SELECT jsonb_agg(jsonb_build_object(
        'id', o.id,
        'question_id', o.question_id,
        'option_text', o.option_text,
        'score', o.score,
        'order_index', o.order_index
      ))
      FROM public.question_options o
      WHERE o.question_id = q.id
    ) AS options
  FROM
    public.esg_questions q
  WHERE
    q.industry = company_industry_value;
END;
$function$;