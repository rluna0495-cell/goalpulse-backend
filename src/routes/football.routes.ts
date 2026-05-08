import { Router } from 'express';
import { footballService } from '../services/football.service';

const router = Router();

// Rutas principales
router.get('/live', async (req, res) => res.json({ data: await footballService.getLive() }));
router.get('/today', async (req, res) => res.json({ data: await footballService.getToday() }));

// Rutas de detalle (Flashscore Style)
router.get('/match/:id/lineups', async (req, res) => res.json({ data: await footballService.getLineups(req.params.id) }));
router.get('/match/:id/stats', async (req, res) => res.json({ data: await footballService.getStats(req.params.id) }));
router.get('/match/h2h/:a/:b', async (req, res) => res.json({ data: await footballService.getH2H(req.params.a, req.params.b) }));

// Rutas de exploración
router.get('/leagues', async (req, res) => res.json({ data: await footballService.getLeagues() }));
router.get('/standings/:leagueId', async (req, res) => res.json({ data: await footballService.getStandings(req.params.leagueId) }));

export default router;