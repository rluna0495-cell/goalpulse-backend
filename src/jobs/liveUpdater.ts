import { io } from '../server';
import { footballService } from '../services/football.service';
import { query } from '../config/db';

export const syncNow = async () => {
  try {
    const matches = await footballService.getLive();
    
    if (!matches || matches.length === 0) {
      console.log('⚠️ [API] La búsqueda devolvió 0 partidos en este momento.');
      return;
    }

    console.log(`📥 [DB] Guardando ${matches.length} partidos en Postgres...`);

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

    console.log('💾 [DB] Sincronización completada con éxito.');
    io.emit('matches_update', matches);
  } catch (error) {
    console.error('❌ [SYNC ERROR]:', error);
  }
};

export const startLiveUpdateJob = () => {
  setInterval(async () => {
    const activeUsers = io?.sockets?.sockets?.size || 0;
    if (activeUsers > 0) {
      console.log(`🔄 [JOB] Actualizando datos para ${activeUsers} usuarios...`);
      await syncNow();
    } else {
      console.log('😴 [JOB] 0 usuarios. Modo ahorro.');
    }
  }, 30000);
};