import { Router, Request, Response } from 'express';
import { verifyWebhookSignature, SignedRequest, buildSignedHeaders } from '../middleware/security';
import {
  Sprint, Task, GovernanceState, ApprovalRequest, SprintStatus, TaskStatus
} from '../types/governance';

export const aiGovernanceRouter = Router();

// In-memory store (replace with DB in production)
let sprints: Sprint[] = [];
let taskCounter = 0;

function findTask(taskId: string): Task | undefined {
  for (const sprint of sprints) {
    const task = sprint.tasks.find(t => t.task_id === taskId);
    if (task) return task;
  }
  return undefined;
}

function getActiveSprint(): Sprint | undefined {
  return sprints.find(s => s.status === 'in_progress' || s.status === 'planning');
}

// GET /admin/ai-governance/state
aiGovernanceRouter.get('/state', (req: Request, res: Response): void => {
  const activeSprint = getActiveSprint();
  const pendingApprovals = sprints
    .flatMap(s => s.tasks)
    .filter(t => t.status === 'awaiting_approval');
  const recentMerges = sprints
    .flatMap(s => s.tasks)
    .filter(t => t.status === 'merged')
    .slice(-10);

  const state: GovernanceState = {
    sprints,
    active_sprint: activeSprint,
    pending_approvals: pendingApprovals,
    recent_merges: recentMerges,
    stats: {
      total_tasks: sprints.reduce((sum, s) => sum + s.tasks.length, 0),
      completed_tasks: sprints.flatMap(s => s.tasks).filter(t => t.status === 'merged').length,
      failed_tasks: sprints.flatMap(s => s.tasks).filter(t => t.status === 'failed' || t.status === 'rejected').length,
      pending_approvals: pendingApprovals.length,
    },
  };
  res.json(state);
});

// POST /admin/ai-governance/start-sprint
aiGovernanceRouter.post('/start-sprint', async (req: Request, res: Response): Promise<void> => {
  const { sprint_id, goal } = req.body;
  if (!sprint_id || !goal) {
    res.status(400).json({ error: 'sprint_id and goal are required' });
    return;
  }

  const sprint: Sprint = {
    sprint_id,
    goal,
    status: 'planning',
    tasks: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  sprints.push(sprint);

  // Trigger n8n SPRINT_ORCHESTRATOR webhook
  const n8nUrl = process.env.N8N_BASE_URL || 'https://vysheshk.app.n8n.cloud';
  const payload = JSON.stringify({ sprint_id, goal, event: 'sprint_started' });

  try {
    const headers = buildSignedHeaders(payload);
    await fetch(n8nUrl + '/webhook/sprint-orchestrator', {
      method: 'POST',
      headers,
      body: payload,
    });
  } catch (err) {
    console.error('Failed to trigger n8n sprint orchestrator:', err);
  }

  res.json({ status: 'sprint_created', sprint });
});

// POST /admin/ai-governance/create-task
aiGovernanceRouter.post('/create-task', (req: Request, res: Response): void => {
  const { sprint_id, description, target_files, risk_level, acceptance_criteria, dependencies } = req.body;
  const sprint = sprints.find(s => s.sprint_id === sprint_id);
  if (!sprint) {
    res.status(404).json({ error: 'Sprint not found' });
    return;
  }

  taskCounter++;
  const task: Task = {
    task_id: `TASK-${sprint_id}-${String(taskCounter).padStart(3, '0')}`,
    sprint_id,
    description,
    target_files: target_files || [],
    risk_level: risk_level || 'medium',
    requires_founder_approval: ['high', 'critical'].includes(risk_level),
    acceptance_criteria: acceptance_criteria || [],
    dependencies: dependencies || [],
    status: 'planned',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  sprint.tasks.push(task);
  sprint.updated_at = new Date().toISOString();
  res.json({ status: 'task_created', task });
});

// POST /admin/ai-governance/approve
aiGovernanceRouter.post('/approve', (req: Request, res: Response): void => {
  const { task_id, reason }: ApprovalRequest = req.body;
  const task = findTask(task_id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  if (task.status !== 'awaiting_approval') {
    res.status(400).json({ error: 'Task is not awaiting approval', current_status: task.status });
    return;
  }

  task.founder_action = { action: 'approve', reason, acted_at: new Date().toISOString() };
  task.status = 'approved';
  task.updated_at = new Date().toISOString();

  // Trigger n8n merge pipeline
  triggerN8nCallback({ event: 'task_completed', task_id, sprint_id: task.sprint_id, data: { action: 'approved' }, timestamp: new Date().toISOString() });

  res.json({ status: 'approved', task });
});

// POST /admin/ai-governance/reject
aiGovernanceRouter.post('/reject', (req: Request, res: Response): void => {
  const { task_id, reason }: ApprovalRequest = req.body;
  const task = findTask(task_id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  task.founder_action = { action: 'reject', reason, acted_at: new Date().toISOString() };
  task.status = 'rejected';
  task.updated_at = new Date().toISOString();
  res.json({ status: 'rejected', task });
});

// POST /admin/ai-governance/callback (n8n -> Replit)
aiGovernanceRouter.post('/callback', verifyWebhookSignature, (req: SignedRequest, res: Response): void => {
  const { event, task_id, sprint_id, data } = req.body;

  if (task_id) {
    const task = findTask(task_id);
    if (task) {
      if (event === 'qa_completed') {
        task.qa_result = data.qa_result;
        task.status = 'data_review';
      } else if (event === 'data_review_completed') {
        task.data_result = data.data_result;
        task.status = 'cto_review';
      } else if (event === 'cto_review_completed') {
        task.cto_verdict = data.cto_verdict;
        if (task.requires_founder_approval && data.cto_verdict?.approved) {
          task.status = 'awaiting_approval';
        } else if (data.cto_verdict?.approved) {
          task.status = 'approved';
        } else {
          task.status = 'failed';
        }
      } else if (event === 'merge_completed') {
        task.status = 'merged';
      } else if (event === 'task_failed') {
        task.status = 'failed';
        task.error = data.error;
      }
      task.updated_at = new Date().toISOString();
    }
  }

  res.json({ status: 'callback_received', event });
});

async function triggerN8nCallback(payload: Record<string, unknown>): Promise<void> {
  const n8nUrl = process.env.N8N_BASE_URL || 'https://vysheshk.app.n8n.cloud';
  const body = JSON.stringify(payload);
  try {
    const headers = buildSignedHeaders(body);
    await fetch(n8nUrl + '/webhook/merge-pipeline', { method: 'POST', headers, body });
  } catch (err) {
    console.error('Failed to trigger n8n callback:', err);
  }
}
