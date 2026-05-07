import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import footballRoutes from './routes/football.routes';
import { startLiveUpdateJob } from './jobs/liveUpdater';

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: "*" }));
app.use(express.json());

export const io = new Server(httpServer, { cors: { origin: "*" } });

const cache: Record<string, { data: any; timestamp: number }> = {};

export const getCache = (key: string) => {
  const item = cache[key];
  if (item && Date.now() - item.timestamp < 60000) return item.data;
  return null;
};

export const setCache = (key: string, data: any) => {
  cache[key] = { data, timestamp: Date.now() };
};

app.use('/api/football', footballRoutes);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 GoalPulse Backend en puerto ${PORT}`);
  startLiveUpdateJob();
});