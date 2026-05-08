import axios from 'axios';

const API_KEY = '75a009d75e2248d2aeb7a2e30fe8cf32';
const apiClient = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: { 'x-apisports-key': API_KEY }
});

export const footballService = {
  // PARTIDOS EN VIVO Y HOY
  getLive: () => apiClient.get('/fixtures', { params: { live: 'all' } }).then(r => r.data.response),
  getToday: () => {
    const today = new Date().toISOString().split('T')[0];
    return apiClient.get('/fixtures', { params: { date: today } }).then(r => r.data.response);
  },

  // DETALLES PROFESIONALES
  getLineups: (id: string) => apiClient.get('/fixtures/lineups', { params: { fixture: id } }).then(r => r.data.response),
  getStats: (id: string) => apiClient.get('/fixtures/statistics', { params: { fixture: id } }).then(r => r.data.response),
  getH2H: (teamA: string, teamB: string) => apiClient.get('/fixtures/headtohead', { params: { h2h: `${teamA}-${teamB}`, last: 5 } }).then(r => r.data.response),

  // LIGAS Y TABLAS (Para el menú mundial)
  getLeagues: () => apiClient.get('/leagues').then(r => r.data.response),
  getStandings: (leagueId: string, season: number = 2024) => 
    apiClient.get('/standings', { params: { league: leagueId, season } }).then(r => r.data.response)
};