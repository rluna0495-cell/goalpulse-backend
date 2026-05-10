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
const db_1 = require("./config/db");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
exports.io = new socket_io_1.Server(httpServer, {
    cors: { origin: true, methods: ['GET', 'POST'], credentials: true }
});
app.use('/api/football', football_routes_1.default);
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
        await (0, db_1.query)(`
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
        await (0, liveUpdater_1.syncNow)();
    }
    catch (err) {
        console.error('⚠️ ERROR AL INICIAR DB:', err instanceof Error ? err.message : err);
    }
};
const PORT = process.env.PORT || 3001;
httpServer.listen(Number(PORT), '0.0.0.0', async () => {
    console.log(`🚀 SERVIDOR FUNCIONANDO EN PUERTO: ${PORT}`);
    await initSystem();
    (0, liveUpdater_1.startLiveUpdateJob)();
});
