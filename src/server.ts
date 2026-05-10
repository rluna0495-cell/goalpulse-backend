import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import footballRoutes from './routes/football.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: { origin: true, methods: ['GET', 'POST'] }
});

const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000;

export function getCache(key: string) {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  return null;
}

export function setCache(key: string, data: any) {
  cache[key] = { data, timestamp: Date.now() };
}

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/football', footballRoutes);

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
});