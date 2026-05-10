import axios from 'axios';

// Ahora el código buscará la llave que pongas en Railway
const API_KEY = process.env.FOOTBALL_API_KEY || '75a009d75e2248d2aeb7a2e30fe8cf32';

const apiClient = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: { 'x-apisports-key': API_KEY }
});

export const footballService = {
  // PARTIDOS EN VIVO Y HOY
  getLive: async () => {
    try {
      const res = await apiClient.get('/fixtures', { params: { live: 'all' } });
      console.log(`[API] Partidos en vivo encontrados: ${res.data.results}`);
      return res.data.response;
    } catch (error) {
      console.error("[API ERROR LIVE]:", error);
      return [];
    }
  },

  getToday: async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const res = await apiClient.get('/fixtures', { params: { date: today } });
      console.log(`[API] Partidos para hoy (${today}): ${res.data.results}`);
      return res.data.response;
    } catch (error) {
      console.error("[API ERROR TODAY]:", error);
      return [];
    }
  },

  // DETALLES PROFESIONALES
  getLineups: (id: string) => apiClient.get('/fixtures/lineups', { params: { fixture: id } }).then(r => r.data.response),
  getStats: (id: string) => apiClient.get('/fixtures/statistics', { params: { fixture: id } }).then(r => r.data.response),
  getH2H: (teamA: string, teamB: string) => apiClient.get('/fixtures/headtohead', { params: { h2h: `${teamA}-${teamB}`, last: 5 } }).then(r => r.data.response),

  // LIGAS Y TABLAS
  getLeagues: () => apiClient.get('/leagues').then(r => r.data.response),
  getStandings: (leagueId: string, season: number = 2026) => 
    apiClient.get('/standings', { params: { league: leagueId, season } }).then(r => r.data.response)
};