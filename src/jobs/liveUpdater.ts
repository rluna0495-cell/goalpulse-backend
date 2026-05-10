import { io } from '../server';
import { footballService } from '../services/football.service';
import { query } from '../config/db';

export const startLiveUpdateJob = () => {
  // Se ejecuta cada 30 segundos
  setInterval(async () => {
    try {
      const activeUsers = io?.sockets?.sockets?.size || 0;

      if (activeUsers > 0) {
        console.log(`[GoalPulse] 🟢 ${activeUsers} usuarios. Sincronizando con API y Postgres...`);
        
        const matches = await footballService.getLive();

        if (matches && matches.length > 0) {
          for (const m of matches) {
            // Guardamos o actualizamos en Postgres
            await query(`
              INSERT INTO matches (fixture_id, league_name, home_team, away_team, home_score, away_score, status)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              ON CONFLICT (fixture_id) DO UPDATE SET
                home_score = EXCLUDED.home_score,
                away_score = EXCLUDED.away_score,
                status = EXCLUDED.status,
                last_update = CURRENT_TIMESTAMP
            `, [
              m.fixture.id,
              m.league.name,
              m.teams.home.name,
              m.teams.away.name,
              m.goals.home,
              m.goals.away,
              m.fixture.status.short
            ]);
          }
          console.log(`[Postgres] 💾 ${matches.length} partidos actualizados.`);
        }

        // Emitimos a la web
        io.emit('matches_update', matches);
      } else {
        console.log('[GoalPulse] 😴 0 usuarios. Modo ahorro activo.');
      }
    } catch (error) {
      console.error('❌ Error en el Job de actualización:', error);
    }
  }, 30000);
};