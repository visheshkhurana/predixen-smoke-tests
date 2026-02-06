// AI Governance Data Models for Predixen.app Build Phase

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'planned' | 'in_progress' | 'qa_review' | 'data_review' | 'cto_review' | 'awaiting_approval' | 'approved' | 'merged' | 'failed' | 'rejected';
export type Verdict = 'PASS' | 'FAIL' | 'NEEDS_CHANGES' | 'NEEDS_REVIEW';
export type SprintStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'aborted';
export type ApprovalAction = 'approve' | 'reject';

export interface Sprint {
  sprint_id: string;        // SPR-001
  goal: string;
  status: SprintStatus;
  plan_id?: string;
  tasks: Task[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Task {
  task_id: string;          // TASK-SPR-001-001
  sprint_id: string;
  description: string;
  target_files: string[];
  risk_level: RiskLevel;
  requires_founder_approval: boolean;
  acceptance_criteria: string[];
  dependencies: string[];
  status: TaskStatus;
  branch_name?: string;     // ai/TASK-SPR-001-001-add-endpoint
  qa_result?: QAResult;
  data_result?: DataResult;
  cto_verdict?: CTOVerdict;
  founder_action?: FounderAction;
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface QAResult {
  verdict: Verdict;
  findings_count: number;
  critical_count: number;
  security_passed: boolean;
  summary: string;
  reviewed_at: string;
}

export interface DataResult {
  verdict: Verdict;
  math_operations_found: number;
  findings_count: number;
  summary: string;
  reviewed_at: string;
}

export interface CTOVerdict {
  approved: boolean;
  reason: string;
  reviewed_at: string;
}

export interface FounderAction {
  action: ApprovalAction;
  reason?: string;
  acted_at: string;
}

export interface ApprovalRequest {
  task_id: string;
  action: ApprovalAction;
  reason?: string;
}

export interface GovernanceState {
  sprints: Sprint[];
  active_sprint?: Sprint;
  pending_approvals: Task[];
  recent_merges: Task[];
  stats: {
    total_tasks: number;
    completed_tasks: number;
    failed_tasks: number;
    pending_approvals: number;
  };
}

export interface WebhookCallback {
  event: 'task_completed' | 'task_failed' | 'approval_required' | 'sprint_completed';
  task_id?: string;
  sprint_id?: string;
  data: Record<string, unknown>;
  timestamp: string;
}
