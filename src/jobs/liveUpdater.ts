import { io } from '../server';
import { footballService } from '../services/football.service';
import { setCache } from '../cache/config';

export const startLiveUpdateJob = () => {
  // Se ejecuta cada 30 segundos
  setInterval(async () => {
    try {
      // Validamos que io y sockets existan para evitar errores de inicio
      const activeUsers = io?.sockets?.sockets?.size || 0;

      if (activeUsers > 0) {
        console.log(`[GoalPulse] 🟢 ${activeUsers} usuarios. Sincronizando...`);
        
        // Llamamos al servicio profesional que organizamos
        const data = await footballService.getLive();

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