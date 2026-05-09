"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const football_service_1 = require("../services/football.service");
const router = (0, express_1.Router)();
// Rutas principales
router.get('/live', async (req, res) => res.json({ data: await football_service_1.footballService.getLive() }));
router.get('/today', async (req, res) => res.json({ data: await football_service_1.footballService.getToday() }));
// Rutas de detalle (Flashscore Style)
router.get('/match/:id/lineups', async (req, res) => res.json({ data: await football_service_1.footballService.getLineups(req.params.id) }));
router.get('/match/:id/stats', async (req, res) => res.json({ data: await football_service_1.footballService.getStats(req.params.id) }));
router.get('/match/h2h/:a/:b', async (req, res) => res.json({ data: await football_service_1.footballService.getH2H(req.params.a, req.params.b) }));
// Rutas de exploración
router.get('/leagues', async (req, res) => res.json({ data: await football_service_1.footballService.getLeagues() }));
router.get('/standings/:leagueId', async (req, res) => res.json({ data: await football_service_1.footballService.getStandings(req.params.leagueId) }));
exports.default = router;
