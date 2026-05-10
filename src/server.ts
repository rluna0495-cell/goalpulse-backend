import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import footballRoutes from './routes/football.routes';
import { startLiveUpdateJob } from './jobs/liveUpdater';
import { query } from './config/db';

const app = express();
const httpServer = createServer(app);

// 1. Configuración de CORS Total
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

app.use(express.json());

// 2. Configuración de Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 3. Rutas
app.use('/api/football', footballRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: '¡GoalPulse Backend conectado a Postgres!' });
});

// 4. Inicialización de Base de Datos (Crea la tabla si no existe)
const initDB = async () => {
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
    console.log('✅ Base de datos verificada: Tabla "matches" lista.');
  } catch (err) {
    console.error('❌ Error crítico inicializando Postgres:', err);
  }
};

// 5. Inicio del Servidor
const PORT = Number(process.env.PORT) || 3001;

httpServer.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 GoalPulse Backend ejecutándose en el puerto ${PORT}`);
  
  // Primero creamos las tablas, luego iniciamos el job
  await initDB();
  startLiveUpdateJob();
});