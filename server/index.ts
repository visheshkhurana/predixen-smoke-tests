import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { founderRouter } from './routes/founder';
import { healthRouter } from './routes/health';
import { decisionsRouter } from './routes/decisions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/founder', founderRouter);
app.use('/api/health', healthRouter);
app.use('/api/decisions', decisionsRouter);

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Predixen.app API',
    version: '0.1.0',
    status: 'running',
    endpoints: ['/api/founder', '/api/health', '/api/decisions']
  });
});

app.listen(PORT, () => {
  console.log('Predixen API running on port ' + PORT);
});

export default app;
