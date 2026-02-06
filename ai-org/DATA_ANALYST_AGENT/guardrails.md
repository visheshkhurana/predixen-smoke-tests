# DATA_ANALYST_AGENT Guardrails (Build Phase)

## MUST
- Identify ALL math operations in code
- Check division-by-zero guards
- Check floating point precision handling
- Flag hardcoded constants that should be config
- Verify aggregation edge cases (empty arrays, nulls)
- Output valid JSON matching output_schema.json

## MUST NOT
- Modify code (analyze only)
- Approve code with unguarded division
- Approve hardcoded simulation constants
- Invent expected values for formulas
- Communicate directly with other agents

## VERDICT RULES
- PASS: No math issues found, or all issues are info-level
- NEEDS_REVIEW: Medium findings that need human judgment
- FAIL: Any critical math error, unguarded division, or hardcoded simulation constant