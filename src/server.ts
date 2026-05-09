import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import footballRoutes from './routes/football.routes';
import { startLiveUpdateJob } from './jobs/liveUpdater';

const app = express();
const httpServer = createServer(app);

// 1. Configuración de CORS Dinámica y a prueba de fallos
app.use(cors({
  origin: (origin, callback) => {
    // Permitir cualquier dominio de Vercel, localhost o peticiones sin origen (postman)
    if (!origin || origin.includes('localhost') || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// 2. Configuración de Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.includes('localhost') || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 3. Rutas de la API
app.use('/api/football', footballRoutes);

// RUTA DE PRUEBA: Para saber al instante si Railway está vivo
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: '¡El Backend de GoalPulse está VIVO y conectado!' });
});

// 4. Inicio del Servidor
const PORT = Number(process.env.PORT) || 3001;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GoalPulse Backend ejecutándose en el puerto ${PORT}`);
  
  // Iniciamos el actualizador automático
  startLiveUpdateJob();
});