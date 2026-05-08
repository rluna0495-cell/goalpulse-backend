import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import footballRoutes from './routes/football.routes';
import { startLiveUpdateJob } from './jobs/liveUpdater';

const app = express();
const httpServer = createServer(app);

// 1. Configuración de CORS Profesional e Híbrida
const allowedOrigins = [
  'http://localhost:3000',
  'https://goalpulse-frontend.vercel.app', // Recuerda cambiar esto por tu URL de Vercel luego
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// 2. Configuración de Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 3. Rutas de la API
app.use('/api/football', footballRoutes);

// 4. Inicio del Servidor
// Convertimos el puerto a Número para evitar el error TS2769
const PORT = Number(process.env.PORT) || 3001;

// Usamos el puerto ya convertido a número
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GoalPulse Backend ejecutándose en el puerto ${PORT}`);
  
  // Iniciamos el actualizador automático
  startLiveUpdateJob();
});