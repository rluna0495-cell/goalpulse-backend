import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import footballRoutes from './routes/football.routes';
import { startLiveUpdateJob, syncNow } from './jobs/liveUpdater';
import { query } from './config/db';

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

export const io = new Server(httpServer, {
  cors: { origin: true, methods: ['GET', 'POST'], credentials: true }
});

app.use('/api/football', footballRoutes);

// RUTA DE VERIFICACIÓN (Pruébala en el navegador)
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ONLINE', 
    version: 'GOALPULSE-V3-ESTABLE',
    info: 'Si ves esto, el código nuevo está activo'
  });
});

const initSystem = async () => {
  console.log('--- INICIANDO SISTEMA DE BASE DE DATOS ---');
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
    console.log('✅ TABLA "matches" LISTA EN POSTGRES');
    
    // Forzamos la primera descarga de datos sin esperar a nadie
    console.log('⚽ SINCRONIZACIÓN INICIAL EN MARCHA...');
    await syncNow();
  } catch (err) {
    console.error('⚠️ ERROR AL INICIAR DB:', err instanceof Error ? err.message : err);
  }
};

const PORT = process.env.PORT || 3001;

httpServer.listen(Number(PORT), '0.0.0.0', async () => {
  console.log(`🚀 SERVIDOR FUNCIONANDO EN PUERTO: ${PORT}`);
  await initSystem();
  startLiveUpdateJob();
});