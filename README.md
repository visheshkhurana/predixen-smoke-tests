# Predixen.app - Business Decision OS

## AI-Only Company Architecture

Predixen is an autonomous business decision operating system where an entire company is run by AI agents, orchestrated through n8n workflows, with a human founder maintaining veto power.

## Architecture

### AI Executive Team
| Agent | Role |
|-------|------|
| CEO_AGENT | Final decision maker - selects from options only |
| CFO_AGENT | Financial analysis and projections |
| CRO_AGENT | Revenue strategy and growth |
| CPO_AGENT | Product roadmap and features |
| CTO_AGENT | Technical architecture and code review |
| RISK_AGENT | Risk evaluation (fails safe to HIGH) |
| CHIEF_OF_STAFF | Request routing and orchestration |
| DEV_AGENT | Code generation (sandboxed) |
| QA_AGENT | Code review and security scanning |

### Core Principles
- JSON-only communication between agents
- No agent can self-approve or self-modify
- Founder has veto power over all decisions
- HIGH/CRITICAL risk decisions require human approval
- All actions are auditable and reversible

## Directory Structure
server/          # REST API + backend
client/          # Founder Control Panel UI
agents/          # Agent runtime configs
ai-org/          # Agent definitions, prompts, schemas
simulation/      # Test scenarios
tests/           # Unit + integration tests
scripts/         # Automation scripts
n8n/             # Workflow specifications
database/        # Schema definitions
docs/            # Documentation

## Webhook Endpoints
- POST /webhook/api/decision
- POST /webhook/founder-panel
- POST /webhook/code-pipeline

## License
Proprietary - Predixen.app
