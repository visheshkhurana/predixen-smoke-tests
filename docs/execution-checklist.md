# How to Turn Predixen Autonomous in 72 Hours

## Pre-Flight (Hour 0-4)
- [ ] Verify all 18 n8n workflows are active and published
- [ ] Test webhook endpoints with sample payloads
- [ ] Verify OpenAI API key is working (send test prompt)
- [ ] Verify GitHub API token scopes
- [ ] Review all agent guardrails files

## Phase 1: Database Setup (Hour 4-8)
- [ ] Create PostgreSQL database (Supabase recommended)
- [ ] Run database/schema.sql to create tables
- [ ] Create connection credentials in n8n
- [ ] Wire MEMORY_WRITER workflow to database

## Phase 2: Server Deployment (Hour 8-16)
- [ ] Deploy server/ to Replit
- [ ] Configure environment variables
- [ ] Test all REST API endpoints
- [ ] Connect Founder Control Panel to n8n webhooks

## Phase 3: Agent Testing (Hour 16-32)
- [ ] Test CHIEF_OF_STAFF routing with sample requests
- [ ] Test each executive agent (CFO, CRO, CPO, CTO) individually
- [ ] Test RISK_AGENT with various risk scenarios
- [ ] Test CEO_AGENT decision selection
- [ ] Verify fail-safe behavior (missing data -> HIGH risk)

## Phase 4: Code Pipeline Testing (Hour 32-48)
- [ ] Submit test task to CODE_REVIEW_PIPELINE
- [ ] Verify DEV_AGENT generates code + tests
- [ ] Verify QA_AGENT reviews and provides verdict
- [ ] Verify CTO_AGENT technical review
- [ ] Test founder approval gate
- [ ] Verify blocked file protection

## Phase 5: Integration Testing (Hour 48-60)
- [ ] End-to-end decision flow test
- [ ] End-to-end code change test
- [ ] Emergency stop test
- [ ] Autonomy level switching test
- [ ] Audit log verification

## Phase 6: Go Live (Hour 60-72)
- [ ] Set autonomy to 'supervised' mode
- [ ] Monitor first 10 autonomous decisions
- [ ] Verify all audit logs are recording
- [ ] Set up alerting for CRITICAL risk events
- [ ] Document any issues found

## Emergency Procedures
1. POST to /webhook/founder-panel with action: emergency_stop
2. All workflows halt immediately
3. Review audit logs for last 1 hour
4. Fix issues, then restart with autonomy: 'manual'
5. Gradually increase to 'supervised' then 'full'

## Success Criteria
- All 9 agents respond with valid JSON
- Risk assessment defaults to HIGH on missing data
- Founder veto works at every gate
- Audit log captures every action
- No blocked files can be modified
- Emergency stop halts all operations within 5 seconds
