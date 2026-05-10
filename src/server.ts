import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import footballRoutes from './routes/football.routes';
import { startLiveUpdateJob } from './jobs/liveUpdater';

const app = express();
const httpServer = createServer(app);

// 1. Configuración de CORS Total (Sin restricciones para asegurar conexión con Vercel)
app.use(cors({
  origin: true, // Esto permite cualquier origen y es compatible con credenciales/cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

app.use(express.json());

// 2. Configuración de Socket.io (También con apertura total)
export const io = new Server(httpServer, {
  cors: {
    origin: true,
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
// Railway asigna el puerto automáticamente mediante process.env.PORT
const PORT = Number(process.env.PORT) || 3001;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GoalPulse Backend ejecutándose en el puerto ${PORT}`);
  
  // Iniciamos el actualizador automático de partidos
  startLiveUpdateJob();
});