import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import footballRoutes from './routes/football.routes';
import { startLiveUpdateJob, syncNow } from './jobs/liveUpdater';
import { query } from './config/db';

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

app.use(express.json());

export const io = new Server(httpServer, {
  cors: { origin: true, methods: ['GET', 'POST'], credentials: true }
});

app.use('/api/football', footballRoutes);

// RUTA DE CONTROL: Si entras aquí y ves este mensaje, el código nuevo está AL AIRE
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ONLINE', 
    version: '2.0-DB-FORCED',
    message: 'Si ves esto, el sistema de base de datos está activo.' 
  });
});

const initSystem = async () => {
  console.log('🚀 [SISTEMA] Iniciando comprobación de Base de Datos...');
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        fixture_id INTEGER UNIQUE,
        league_name TEXT,
        home_team TEXT,
        away_team TEXT,
        home_score INTEGER,
        away_score INTEGER,
        status TEXT,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ [DATABASE] Tabla "matches" verificada y lista.');

    console.log('📡 [SYNC] Forzando primera carga de datos...');
    await syncNow(); 
    
  } catch (err) {
    console.error('❌ [ERROR CRÍTICO] No se pudo iniciar la DB:', err);
  }
};

const PORT = Number(process.env.PORT) || 8080;

httpServer.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n--- GOALPULSE BACKEND v2.0 ---\n`);
  console.log(`📡 Puerto: ${PORT}`);
  await initSystem();
  startLiveUpdateJob();
});