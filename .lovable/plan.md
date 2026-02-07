

# Fix: Ambiguous Column Reference in get_questions_for_company Function

## Problem
The `get_questions_for_company` database function is returning a 400 error because PostgreSQL cannot determine which `industry` column is being referenced in the WHERE clause. The function's return table definition includes an `industry` column, which conflicts with the `industry` column in the CTE (Common Table Expression).

## Root Cause
In the current function:
```sql
WHERE q.industry = (SELECT industry FROM company_industry);
```

PostgreSQL sees `industry` and cannot decide if it refers to:
- The return table's `industry` column
- The CTE's `industry` column

## Solution
Update the database function to fully qualify the column reference in the CTE subquery by aliasing it properly.

## Changes Required

### Database Migration
Create a new migration to replace the function with a fixed version:

```sql
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
```

## Technical Details

The fix uses a DECLARE block to store the company's industry in a local variable (`company_industry_value`) before running the main query. This eliminates the ambiguity because:
- The variable name is distinct from any column names
- The WHERE clause now clearly references `q.industry = company_industry_value`

## Expected Outcome
After applying this fix:
- The questionnaire page will load correctly for finance and technology companies
- All 30 finance questions and 32 technology questions will display properly
- Companies can answer questions and calculate their ESG scores

