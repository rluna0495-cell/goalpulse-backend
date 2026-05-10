import { io } from '../server';
import { footballService } from '../services/football.service';
import { query } from '../config/db';

// Función para sincronizar sin importar si hay usuarios o no
export const syncNow = async () => {
  try {
    const matches = await footballService.getLive();
    if (matches && matches.length > 0) {
      for (const m of matches) {
        await query(`
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
      console.log(`[Postgres] 💾 ${matches.length} partidos guardados.`);
      io.emit('matches_update', matches);
    } else {
      console.log('[GoalPulse] ⚠️ La API no devolvió partidos en vivo ahora.');
    }
  } catch (error) {
    console.error('❌ Fallo en sincronización:', error);
  }
};

export const startLiveUpdateJob = () => {
  setInterval(async () => {
    const activeUsers = io?.sockets?.sockets?.size || 0;
    if (activeUsers > 0) {
      console.log(`[GoalPulse] 🟢 Sincronizando para ${activeUsers} usuarios...`);
      await syncNow();
    } else {
      console.log('[GoalPulse] 😴 0 usuarios. Modo ahorro.');
    }
  }, 30000);
};