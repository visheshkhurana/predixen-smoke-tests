# n8n Workflow Specifications

## Active Workflows (18 total)

### Core Decision Engine
| ID | Workflow | Trigger | Status |
|----|----------|---------|--------|
| WF-001 | CEO_DECISION_ENGINE | Webhook: /api/decision | Active |
| WF-002 | CHIEF_OF_STAFF_AGENT | Sub-workflow | Active |
| WF-008 | CEO_AGENT | Sub-workflow | Active |

### Executive Agents
| ID | Workflow | Trigger | Status |
|----|----------|---------|--------|
| WF-003 | CFO_AGENT | Sub-workflow | Active |
| WF-004 | CRO_AGENT | Sub-workflow | Active |
| WF-005 | CPO_AGENT | Sub-workflow | Active |
| WF-006 | CTO_AGENT | Sub-workflow | Active |
| WF-007 | RISK_AGENT | Sub-workflow | Active |

### Support Agents
| ID | Workflow | Trigger | Status |
|----|----------|---------|--------|
| WF-009 | AUTOMATION_AGENT | Sub-workflow | Active |
| WF-010 | REPORTING_AGENT | Sub-workflow | Active |
| WF-011 | DATA_VALIDATION_AGENT | Sub-workflow | Active |

### Founder Control
| ID | Workflow | Trigger | Status |
|----|----------|---------|--------|
| WF-012 | FOUNDER_CONTROL_PANEL_API | Webhook: /founder-panel | Active |

### Code Pipeline
| ID | Workflow | Trigger | Status |
|----|----------|---------|--------|
| WF-013 | DEV_AGENT | Sub-workflow | Active |
| WF-014 | QA_AGENT | Sub-workflow | Active |
| WF-015 | CODE_REVIEW_PIPELINE | Webhook: /code-pipeline | Active |
| WF-016 | REPLIT_INTEGRATION | Sub-workflow | Active |

### System
| ID | Workflow | Trigger | Status |
|----|----------|---------|--------|
| WF-017 | MEMORY_WRITER | Sub-workflow | Active |
| WF-018 | SCHEDULED_HEALTH_CHECK | Cron: every 6 hours | Active |

## Webhook Endpoints
- POST https://vysheshk.app.n8n.cloud/webhook/api/decision
- POST https://vysheshk.app.n8n.cloud/webhook/founder-panel
- POST https://vysheshk.app.n8n.cloud/webhook/code-pipeline

## Credential Requirements
- OpenAI API (for LLM agent nodes)
- GitHub API (for code operations)
- PostgreSQL (for memory/audit - to be configured)
