import axios from 'axios';

const API_KEY = '75a009d75e2248d2aeb7a2e30fe8cf32';
const apiClient = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: { 'x-apisports-key': API_KEY }
});

export const getLiveMatches = () => 
  apiClient.get('/fixtures', { params: { live: 'all' } }).then(r => r.data.response);

export const getTodayMatches = () => 
  apiClient.get('/fixtures', { params: { date: new Date().toISOString().split('T')[0] } }).then(r => r.data.response);

export const getMatchById = (id: any) => 
  apiClient.get('/fixtures', { params: { id } }).then(r => r.data.response);

export const getMatchLineups = (id: any) => 
  apiClient.get('/fixtures/lineups', { params: { fixture: id } }).then(r => r.data.response);

export const getMatchStats = (id: any) => 
  apiClient.get('/fixtures/statistics', { params: { fixture: id } }).then(r => r.data.response);

export const getMatchesByLeague = (id: any) => 
  apiClient.get('/fixtures', { params: { league: id, date: new Date().toISOString().split('T')[0] } }).then(r => r.data.response);

export const getStandings = (id: any) => 
  apiClient.get('/standings', { params: { league: id, season: new Date().getFullYear() } }).then(r => r.data.response);