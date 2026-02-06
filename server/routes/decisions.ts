import { Router, Request, Response } from 'express';

export const decisionsRouter = Router();

decisionsRouter.get('/', async (req: Request, res: Response) => {
  res.json({ decisions: [], total: 0 });
});

decisionsRouter.post('/', async (req: Request, res: Response) => {
  const { title, description, type } = req.body;
  res.json({
    decision_id: 'dec_' + Date.now(),
    title, description, type,
    status: 'pending',
    created_at: new Date().toISOString()
  });
});
