"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const football_routes_1 = __importDefault(require("./routes/football.routes"));
const liveUpdater_1 = require("./jobs/liveUpdater");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// 1. Configuración de CORS Dinámica y a prueba de fallos
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Permitir cualquier dominio de Vercel, localhost o peticiones sin origen (postman)
        if (!origin || origin.includes('localhost') || origin.includes('vercel.app')) {
            callback(null, true);
        }
        else {
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express_1.default.json());
// 2. Configuración de Socket.io
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || origin.includes('localhost') || origin.includes('vercel.app')) {
                callback(null, true);
            }
            else {
                callback(new Error('Origen no permitido por CORS'));
            }
        },
        methods: ['GET', 'POST'],
        credentials: true
    }
});
// 3. Rutas de la API
app.use('/api/football', football_routes_1.default);
// RUTA DE PRUEBA: Para saber al instante si Railway está vivo
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: '¡El Backend de GoalPulse está VIVO y conectado!' });
});
// 4. Inicio del Servidor
const PORT = Number(process.env.PORT) || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GoalPulse Backend ejecutándose en el puerto ${PORT}`);
    // Iniciamos el actualizador automático
    (0, liveUpdater_1.startLiveUpdateJob)();
});
