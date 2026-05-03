"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const football_service_1 = require("../services/football.service");
const router = (0, express_1.Router)();
router.get('/today', async (req, res) => {
    try {
        const leagueId = req.query.league ? Number(req.query.league) : undefined;
        const matches = await (0, football_service_1.getTodayMatches)(leagueId);
        res.json({ success: true, data: matches });
    }
    catch {
        res.status(500).json({ success: false, message: 'Error obteniendo partidos' });
    }
});
router.get('/live', async (req, res) => {
    try {
        const matches = await (0, football_service_1.getLiveMatches)();
        res.json({ success: true, data: matches });
    }
    catch {
        res.status(500).json({ success: false, message: 'Error obteniendo partidos en vivo' });
    }
});
router.get('/standings', async (req, res) => {
    try {
        const { league, season } = req.query;
        if (!league || !season) {
            res.status(400).json({ success: false, message: 'league y season son requeridos' });
            return;
        }
        const standings = await (0, football_service_1.getStandings)(Number(league), Number(season));
        res.json({ success: true, data: standings });
    }
    catch {
        res.status(500).json({ success: false, message: 'Error obteniendo standings' });
    }
});
router.get('/match/:id', async (req, res) => {
    try {
        const match = await (0, football_service_1.getMatchDetail)(Number(req.params.id));
        res.json({ success: true, data: match });
    }
    catch {
        res.status(500).json({ success: false, message: 'Error obteniendo detalle del partido' });
    }
});
exports.default = router;
