import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/', async (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    active_workflows: 18,
    uptime: process.uptime()
  });
});

healthRouter.get('/agents', async (req: Request, res: Response) => {
  const agents = [
    'CEO_AGENT', 'CFO_AGENT', 'CRO_AGENT', 'CPO_AGENT',
    'CTO_AGENT', 'RISK_AGENT', 'CHIEF_OF_STAFF', 'DEV_AGENT', 'QA_AGENT'
  ].map(name => ({
    agent_name: name,
    status: 'active',
    last_active: new Date().toISOString(),
    executions_today: 0,
    error_count: 0
  }));
  res.json({ agents });
});
