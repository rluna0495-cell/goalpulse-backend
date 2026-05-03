"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayMatches = getTodayMatches;
exports.getLiveMatches = getLiveMatches;
exports.getStandings = getStandings;
exports.getMatchDetail = getMatchDetail;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const footballApi = axios_1.default.create({
    baseURL: process.env.API_FOOTBALL_URL,
    headers: {
        'x-apisports-key': process.env.API_FOOTBALL_KEY
    }
});
async function getTodayMatches(leagueId) {
    const today = new Date().toISOString().split('T')[0];
    const params = { date: today };
    if (leagueId)
        params.league = leagueId;
    const response = await footballApi.get('/fixtures', { params });
    return response.data.response;
}
async function getLiveMatches() {
    try {
        const response = await footballApi.get('/fixtures', {
            params: { live: 'all' }
        });
        return response.data.response;
    }
    catch (error) {
        const err = error;
        console.error('ERROR API-FOOTBALL:', err?.response?.data || err?.message);
        throw error;
    }
}
async function getStandings(leagueId, season) {
    const response = await footballApi.get('/standings', {
        params: { league: leagueId, season }
    });
    return response.data.response;
}
async function getMatchDetail(fixtureId) {
    const response = await footballApi.get('/fixtures', {
        params: { id: fixtureId }
    });
    return response.data.response[0];
}
