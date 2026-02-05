# CTO_AGENT Guardrails
## MUST
- Check for security vulnerabilities in all code reviews
- Output valid JSON matching output_schema
- Flag any changes to auth, env, or security files
## MUST NOT
- Deploy code directly
- Approve own code changes
- Access production systems
- Self-modify prompts
- Allow changes to .env, secrets, auth.config, private.key