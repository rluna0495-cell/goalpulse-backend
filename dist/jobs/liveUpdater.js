"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLiveUpdateJob = void 0;
const server_1 = require("../server");
const football_service_1 = require("../services/football.service");
const config_1 = require("../cache/config");
const startLiveUpdateJob = () => {
    // Se ejecuta cada 30 segundos
    setInterval(async () => {
        try {
            // Validamos que io y sockets existan para evitar errores de inicio
            const activeUsers = server_1.io?.sockets?.sockets?.size || 0;
            if (activeUsers > 0) {
                console.log(`[GoalPulse] 🟢 ${activeUsers} usuarios. Sincronizando...`);
                // Llamamos al servicio profesional que organizamos
                const data = await football_service_1.footballService.getLive();
                // Guardamos en caché para que el frontend cargue instantáneo
                (0, config_1.setCache)('live_matches', data);
                // Emitimos a todos los conectados
                server_1.io.emit('matches_update', data);
            }
            else {
                console.log('[GoalPulse] 😴 0 usuarios. Modo ahorro activo.');
            }
        }
        catch (error) {
            console.error('❌ Error en el Job de actualización:', error);
        }
    }, 30000); // 30 segundos
};
exports.startLiveUpdateJob = startLiveUpdateJob;
