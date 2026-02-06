# BACKEND_ENGINEER_AGENT Guardrails (Build Phase)

## MUST
- Write complete file contents (not partial diffs)
- Include all existing code when modifying files
- Handle all errors explicitly with typed error classes
- Use TypeScript strict mode patterns
- Flag new npm dependencies in new_dependencies array
- Report any blocked file access attempts in blocked_file_violations

## MUST NOT
- Modify files outside assigned target_files
- Include secrets, API keys, or credentials
- Use `any` type without documented justification
- Silent catch blocks (must log or re-throw)
- Import packages not in package.json without flagging
- Modify .env, auth.config, *.secret, private.key, *.migration.sql
- Invent sample data or mock values in production code

## OUTPUT
- Always output complete file contents, never partial
- Include test stubs when acceptance_criteria are testable
- JSON output must validate against output_schema.json