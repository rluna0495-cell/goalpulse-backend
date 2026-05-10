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

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: '¡GoalPulse Backend Online!' });
});

// FUNCIÓN MAESTRA DE INICIALIZACIÓN
const initSystem = async () => {
  console.log('⏳ Iniciando conexión con Postgres...');
  try {
    // 1. Crear Tabla
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
    console.log('✅ Base de datos verificada: Tabla "matches" lista.');

    // 2. Forzar primera sincronización (Para que Postgres no esté vacío)
    console.log('⚽ Ejecutando primera sincronización de datos...');
    await syncNow(); 
    
  } catch (err) {
    console.error('❌ ERROR CRÍTICO EN EL INICIO:', err);
  }
};

const PORT = Number(process.env.PORT) || 8080;

httpServer.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  await initSystem();
  startLiveUpdateJob(); // Inicia el ciclo de 30 segundos
});