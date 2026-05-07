import { io, setCache, getCache } from '../server';
import * as footballService from '../services/football.service';

export const startLiveUpdateJob = () => {
  setInterval(async () => {
    try {
      const activeUsers = io.sockets.sockets.size;

      if (activeUsers > 0) {
        console.log(`[GoalPulse] 🟢 ${activeUsers} usuarios. Sincronizando...`);
        const data = await footballService.getLiveMatches();
        
        // Guardamos en caché para que el frontend cargue instantáneo
        setCache('live_matches', data);
        
        // Emitimos a todos los conectados
        io.emit('matches_update', data);
      } else {
        console.log('[GoalPulse] 😴 0 usuarios. Modo ahorro activo.');
      }
    } catch (error) {
      console.error('❌ Error en el Job de actualización:', error);
    }
  }, 30000); // 30 segundos
};