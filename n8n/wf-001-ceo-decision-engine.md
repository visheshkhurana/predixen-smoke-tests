# WF-001: CEO_DECISION_ENGINE

## Purpose
Master orchestrator that receives business decisions via webhook and routes them through the full agent pipeline.

## Trigger
Webhook: POST /webhook/api/decision

## Flow
1. Receive webhook payload
2. Validate input via DATA_VALIDATION_AGENT (WF-011)
3. Route via CHIEF_OF_STAFF (WF-002) to determine which agents to consult
4. Fan out to relevant executive agents (CFO/CRO/CPO/CTO)
5. Collect responses and pass to RISK_AGENT (WF-007)
6. Package options for CEO_AGENT (WF-008)
7. CEO selects option
8. If HIGH/CRITICAL risk: queue for founder approval
9. If LOW/MEDIUM risk: execute autonomously
10. Log to MEMORY_WRITER (WF-017)
11. Return result via webhook response

## Input Schema
See: ai-org/ceo_agent/input_schema.json

## Nodes (27 total)
- Webhook trigger
- Input validation
- Chief of Staff routing
- Executive agent sub-workflow calls
- Response aggregation
- Risk assessment
- CEO decision
- Approval gate (conditional)
- Memory logging
- Webhook response

## Error Handling
- Any node failure triggers RISK_AGENT with CRITICAL level
- Timeout after 30 seconds per agent
- Fallback to founder manual review on pipeline failure
