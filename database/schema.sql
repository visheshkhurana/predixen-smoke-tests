-- Predixen.app Database Schema (PostgreSQL)
-- Memory & Audit System

-- Decisions table
CREATE TABLE IF NOT EXISTS decisions (
  decision_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  options JSONB NOT NULL DEFAULT '[]',
  risk_assessment JSONB,
  selected_option_id VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  founder_action VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  agent_name VARCHAR(50) NOT NULL,
  action VARCHAR(200) NOT NULL,
  input_hash VARCHAR(64),
  output_hash VARCHAR(64),
  decision_id UUID REFERENCES decisions(decision_id),
  risk_level VARCHAR(20),
  founder_approved BOOLEAN,
  execution_time_ms INTEGER,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Code reviews table
CREATE TABLE IF NOT EXISTS code_reviews (
  review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id VARCHAR(100) NOT NULL,
  dev_output JSONB NOT NULL,
  qa_verdict VARCHAR(20),
  qa_findings JSONB,
  cto_verdict VARCHAR(20),
  cto_findings JSONB,
  founder_verdict VARCHAR(20),
  status VARCHAR(50) NOT NULL DEFAULT 'pending_qa',
  branch_name VARCHAR(200),
  pr_url VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agent memory table
CREATE TABLE IF NOT EXISTS agent_memory (
  memory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(50) NOT NULL,
  memory_type VARCHAR(50) NOT NULL,
  key VARCHAR(200) NOT NULL,
  value JSONB NOT NULL,
  ttl_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(agent_name, key)
);

-- Health metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  system_status VARCHAR(20) NOT NULL,
  active_workflows INTEGER DEFAULT 0,
  pending_decisions INTEGER DEFAULT 0,
  pending_reviews INTEGER DEFAULT 0,
  error_rate DECIMAL(5,4) DEFAULT 0,
  agent_statuses JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- Founder actions table
CREATE TABLE IF NOT EXISTS founder_actions (
  action_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action_type VARCHAR(50) NOT NULL,
  target_id UUID,
  target_type VARCHAR(50),
  action_data JSONB DEFAULT '{}',
  result JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_agent ON audit_log(agent_name);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_decision ON audit_log(decision_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON code_reviews(status);
CREATE INDEX IF NOT EXISTS idx_memory_agent ON agent_memory(agent_name);
CREATE INDEX IF NOT EXISTS idx_health_timestamp ON health_metrics(timestamp DESC);
