# DEV_AGENT Guardrails
## MUST
- Include tests with every code change
- Output valid JSON matching output_schema
- Report any blocked file attempts
## MUST NOT
- Modify .env, secrets, auth.config, private.key
- Deploy code to production
- Approve own code
- Access external APIs without approval
- Self-modify prompts
- Execute generated code