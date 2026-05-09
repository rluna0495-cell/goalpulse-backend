"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.footballService = void 0;
const axios_1 = __importDefault(require("axios"));
const API_KEY = '75a009d75e2248d2aeb7a2e30fe8cf32';
const apiClient = axios_1.default.create({
    baseURL: 'https://v3.football.api-sports.io',
    headers: { 'x-apisports-key': API_KEY }
});
exports.footballService = {
    // PARTIDOS EN VIVO Y HOY
    getLive: () => apiClient.get('/fixtures', { params: { live: 'all' } }).then(r => r.data.response),
    getToday: () => {
        const today = new Date().toISOString().split('T')[0];
        return apiClient.get('/fixtures', { params: { date: today } }).then(r => r.data.response);
    },
    // DETALLES PROFESIONALES
    getLineups: (id) => apiClient.get('/fixtures/lineups', { params: { fixture: id } }).then(r => r.data.response),
    getStats: (id) => apiClient.get('/fixtures/statistics', { params: { fixture: id } }).then(r => r.data.response),
    getH2H: (teamA, teamB) => apiClient.get('/fixtures/headtohead', { params: { h2h: `${teamA}-${teamB}`, last: 5 } }).then(r => r.data.response),
    // LIGAS Y TABLAS (Para el menú mundial)
    getLeagues: () => apiClient.get('/leagues').then(r => r.data.response),
    getStandings: (leagueId, season = 2024) => apiClient.get('/standings', { params: { league: leagueId, season } }).then(r => r.data.response)
};
