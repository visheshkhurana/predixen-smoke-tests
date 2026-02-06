// Predixen.app TypeScript Interfaces

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DecisionType = 'strategic' | 'operational' | 'financial' | 'product' | 'technical';
export type Verdict = 'APPROVE' | 'REJECT' | 'NEEDS_CHANGES';
export type AgentName = 'CEO_AGENT' | 'CFO_AGENT' | 'CRO_AGENT' | 'CPO_AGENT' | 'CTO_AGENT' | 'RISK_AGENT' | 'CHIEF_OF_STAFF' | 'DEV_AGENT' | 'QA_AGENT';

export interface Decision {
  decision_id: string;
  decision_type: DecisionType;
  title: string;
  description: string;
  options: DecisionOption[];
  risk_assessment: RiskAssessment;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  created_at: string;
  resolved_at?: string;
  founder_action?: 'approved' | 'rejected' | 'vetoed';
}

export interface DecisionOption {
  option_id: string;
  label: string;
  source_agent: AgentName;
  metrics: Record<string, number>;
  recommended: boolean;
}

export interface RiskAssessment {
  risk_level: RiskLevel;
  flags: string[];
  requires_approval: boolean;
  mitigation_steps: string[];
}

export interface CodeReview {
  review_id: string;
  task_id: string;
  dev_agent_output: DevAgentOutput;
  qa_verdict: Verdict;
  cto_verdict: Verdict;
  founder_verdict?: Verdict;
  status: 'pending_qa' | 'pending_cto' | 'pending_founder' | 'approved' | 'rejected';
  created_at: string;
}

export interface DevAgentOutput {
  task_id: string;
  changes: FileChange[];
  tests_included: boolean;
  blocked_file_attempts: string[];
}

export interface FileChange {
  file_path: string;
  action: 'create' | 'modify' | 'delete';
  content: string;
  diff?: string;
}

export interface HealthMetrics {
  timestamp: string;
  system_status: 'healthy' | 'degraded' | 'critical';
  active_workflows: number;
  pending_decisions: number;
  pending_code_reviews: number;
  last_execution: string;
  error_rate: number;
  agents: AgentHealth[];
}

export interface AgentHealth {
  agent_name: AgentName;
  status: 'active' | 'idle' | 'error';
  last_active: string;
  executions_today: number;
  error_count: number;
}

export interface AuditLogEntry {
  log_id: string;
  timestamp: string;
  agent: AgentName;
  action: string;
  input_hash: string;
  output_hash: string;
  decision_id?: string;
  risk_level?: RiskLevel;
  founder_approved?: boolean;
}

export interface FounderControlState {
  autonomy_level: 'full' | 'supervised' | 'manual';
  emergency_stop: boolean;
  approval_queue: Decision[];
  code_review_queue: CodeReview[];
  recent_audit: AuditLogEntry[];
}
