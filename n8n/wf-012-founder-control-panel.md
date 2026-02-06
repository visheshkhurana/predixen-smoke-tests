# WF-012: FOUNDER_CONTROL_PANEL_API

## Purpose
REST API backend for the Founder Control Panel. Handles all founder interactions with the AI system.

## Trigger
Webhook: POST /webhook/founder-panel

## Routes (via Switch node)
| Action | Description |
|--------|-------------|
| get_decisions | List pending decisions |
| approve_decision | Approve a pending decision |
| reject_decision | Reject a pending decision |
| get_health | System health metrics |
| get_tasks | Active task list |
| get_code_reviews | Pending code reviews |
| approve_code | Approve a code change |
| emergency_stop | Halt all autonomous operations |
| set_autonomy | Set autonomy level (full/supervised/manual) |
| get_audit_log | Retrieve audit entries |

## Input
JSON body with 'action' field + action-specific parameters

## Emergency Stop Behavior
When emergency_stop is triggered:
1. Set global flag to halt all workflows
2. Notify all active agents to stop
3. Log the emergency stop event
4. Return confirmation to founder
