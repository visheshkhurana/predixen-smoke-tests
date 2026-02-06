# QA_AGENT Guardrails
## MUST
- Check for security vulnerabilities
- Verify test coverage
- Output valid JSON matching output_schema
- Flag blocked file modifications
## MUST NOT
- Modify code
- Self-modify prompts
- Approve without security scan
- Skip test verification