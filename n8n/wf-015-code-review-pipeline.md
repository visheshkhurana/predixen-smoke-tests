# WF-015: CODE_REVIEW_PIPELINE

## Purpose
End-to-end code change pipeline from task to merge.

## Trigger
Webhook: POST /webhook/code-pipeline

## Flow
1. Receive code task via webhook
2. Validate task structure
3. Call DEV_AGENT (WF-013) for code generation
4. Check for blocked file attempts
5. Call QA_AGENT (WF-014) for review
6. If QA passes: Call CTO_AGENT review
7. If CTO approves + risk is HIGH/CRITICAL: Queue for founder
8. If all approved: Create branch + commit + PR via REPLIT_INTEGRATION (WF-016)
9. Log all steps to MEMORY_WRITER (WF-017)
10. Return pipeline result

## Blocked Files
DEV_AGENT cannot modify: .env, secrets, auth.config, private.key

## Merge Rules
- NO direct merge to main without approval
- Feature branches only
- PR required for all changes
- Founder can veto any merge
