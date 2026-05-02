import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const footballApi = axios.create({
  baseURL: process.env.API_FOOTBALL_URL as string,
  headers: {
    'x-apisports-key': process.env.API_FOOTBALL_KEY as string
  }
});

export async function getTodayMatches(leagueId?: number) {
  const today = new Date().toISOString().split('T')[0];
  const params: Record<string, unknown> = { date: today };
  if (leagueId) params.league = leagueId;
  const response = await footballApi.get('/fixtures', { params });
  return response.data.response;
}

export async function getLiveMatches() {
  try {
    const response = await footballApi.get('/fixtures', {
      params: { live: 'all' }
    });
    return response.data.response;
  } catch (error: unknown) {
    const err = error as { response?: { data: unknown }; message: string };
    console.error('ERROR API-FOOTBALL:', err?.response?.data || err?.message);
    throw error;
  }
}

export async function getStandings(leagueId: number, season: number) {
  const response = await footballApi.get('/standings', {
    params: { league: leagueId, season }
  });
  return response.data.response;
}

export async function getMatchDetail(fixtureId: number) {
  const response = await footballApi.get('/fixtures', {
    params: { id: fixtureId }
  });
  return response.data.response[0];
}