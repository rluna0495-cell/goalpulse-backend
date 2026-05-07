import { Router } from 'express';
import * as footballService from '../services/football.service';

const router = Router();

router.get('/live', async (req, res) => {
  try { res.json({ data: await footballService.getLiveMatches() }); } 
  catch (e) { res.status(500).json({ error: "Error" }); }
});

router.get('/today', async (req, res) => {
  try { res.json({ data: await footballService.getTodayMatches() }); } 
  catch (e) { res.status(500).json({ error: "Error" }); }
});

router.get('/match/:id', async (req, res) => {
  try { res.json({ data: await footballService.getMatchById(req.params.id) }); } 
  catch (e) { res.status(500).json({ error: "Error" }); }
});

router.get('/match/:id/lineups', async (req, res) => {
  try { res.json({ data: await footballService.getMatchLineups(req.params.id) }); } 
  catch (e) { res.status(500).json({ error: "Error" }); }
});

router.get('/match/:id/stats', async (req, res) => {
  try { res.json({ data: await footballService.getMatchStats(req.params.id) }); } 
  catch (e) { res.status(500).json({ error: "Error" }); }
});

router.get('/league/:id', async (req, res) => {
  try { res.json({ data: await footballService.getMatchesByLeague(req.params.id) }); } 
  catch (e) { res.status(500).json({ error: "Error" }); }
});

router.get('/standings/:id', async (req, res) => {
  try { res.json({ data: await footballService.getStandings(req.params.id) }); } 
  catch (e) { res.status(500).json({ error: "Error" }); }
});

export default router;