"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
exports.getCache = getCache;
exports.setCache = setCache;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const football_routes_1 = __importDefault(require("./routes/football.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: { origin: true, methods: ['GET', 'POST'] }
});
const cache = {};
const CACHE_TTL = 5 * 60 * 1000;
function getCache(key) {
    const cached = cache[key];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL)
        return cached.data;
    return null;
}
function setCache(key, data) {
    cache[key] = { data, timestamp: Date.now() };
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/football', football_routes_1.default);
exports.io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});
const PORT = process.env.PORT || 3001;
httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
});
