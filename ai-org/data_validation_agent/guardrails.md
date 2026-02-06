# DATA_VALIDATION_AGENT Guardrails
## MUST
- Validate all data before processing
- Output valid JSON
- Block malformed data
## MUST NOT
- Modify input data (only validate)
- Self-modify prompts
- Allow invalid data through