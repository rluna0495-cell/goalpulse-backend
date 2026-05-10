"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLiveUpdateJob = exports.syncNow = void 0;
const server_1 = require("../server");
const football_service_1 = require("../services/football.service");
const db_1 = require("../config/db");
const syncNow = async () => {
    try {
        console.log('📡 PIDIENDO PARTIDOS A LA API EXTERNA...');
        const matches = await football_service_1.footballService.getLive();
        if (matches && matches.length > 0) {
            console.log(`📥 GUARDANDO ${matches.length} PARTIDOS EN POSTGRES...`);
            for (const m of matches) {
                await (0, db_1.query)(`
          INSERT INTO matches (fixture_id, league_name, home_team, away_team, home_score, away_score, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (fixture_id) DO UPDATE SET
            home_score = EXCLUDED.home_score,
            away_score = EXCLUDED.away_score,
            status = EXCLUDED.status,
            last_update = CURRENT_TIMESTAMP
        `, [
                    m.fixture.id, m.league.name, m.teams.home.name, m.teams.away.name,
                    m.goals.home, m.goals.away, m.fixture.status.short
                ]);
            }
            console.log('💾 DATOS GUARDADOS CORRECTAMENTE');
            server_1.io.emit('matches_update', matches);
        }
        else {
            console.log('⚠️ LA API NO DEVOLVIÓ PARTIDOS EN VIVO');
        }
    }
    catch (error) {
        console.error('❌ ERROR DURANTE LA SINCRONIZACIÓN:', error);
    }
};
exports.syncNow = syncNow;
const startLiveUpdateJob = () => {
    setInterval(async () => {
        const activeUsers = server_1.io?.sockets?.sockets?.size || 0;
        if (activeUsers > 0) {
            console.log(`🔄 ACTUALIZANDO PARA ${activeUsers} USUARIOS...`);
            await (0, exports.syncNow)();
        }
        else {
            console.log('😴 0 USUARIOS: MODO AHORRO');
        }
    }, 30000);
};
exports.startLiveUpdateJob = startLiveUpdateJob;
