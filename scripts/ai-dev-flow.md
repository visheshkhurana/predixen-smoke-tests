# AI Development Loop Flow

## Overview
The AI Development Loop enables autonomous code changes through a gated pipeline:
DEV_AGENT -> QA_AGENT -> CTO_AGENT -> FOUNDER_APPROVAL -> MERGE

## Flow Steps

### 1. Task Assignment
- Task enters via CODE_REVIEW_PIPELINE webhook
- Task is validated against schema
- DEV_AGENT receives structured task description

### 2. Code Generation (DEV_AGENT)
- Receives task_id, description, target_files, constraints
- Generates code changes as structured diffs
- Must include tests
- Cannot modify: .env, secrets, auth.config, private.key
- Output: changes array + test files

### 3. QA Review (QA_AGENT)
- Receives code changes from DEV_AGENT
- Performs security scan
- Verifies test coverage
- Checks for blocked file modifications
- Output: PASS / FAIL / NEEDS_CHANGES

### 4. Technical Review (CTO_AGENT)
- Reviews architecture impact
- Checks security vulnerabilities
- Validates against coding standards
- Output: APPROVE / REJECT / NEEDS_CHANGES

### 5. Founder Approval Gate
- Only triggered for HIGH/CRITICAL risk changes
- Founder reviews via Control Panel
- Can APPROVE, REJECT, or request changes
- Founder has veto power at all times

### 6. Merge & Deploy
- Approved changes committed to feature branch
- PR created against main
- NO direct merges to main without approval
- Deploy via Replit integration

## Guardrails
- All communication is JSON-only
- No agent can self-approve
- Risk assessment on every change
- Audit log for every step
- Emergency stop halts all pipelines
