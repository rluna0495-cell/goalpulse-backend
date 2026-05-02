import { Router, Request, Response } from 'express';
import { getTodayMatches, getLiveMatches, getStandings, getMatchDetail } from '../services/football.service';

const router = Router();

router.get('/today', async (req: Request, res: Response): Promise<void> => {
  try {
    const leagueId = req.query.league ? Number(req.query.league) : undefined;
    const matches = await getTodayMatches(leagueId);
    res.json({ success: true, data: matches });
  } catch {
    res.status(500).json({ success: false, message: 'Error obteniendo partidos' });
  }
});

router.get('/live', async (req: Request, res: Response): Promise<void> => {
  try {
    const matches = await getLiveMatches();
    res.json({ success: true, data: matches });
  } catch {
    res.status(500).json({ success: false, message: 'Error obteniendo partidos en vivo' });
  }
});

router.get('/standings', async (req: Request, res: Response): Promise<void> => {
  try {
    const { league, season } = req.query;
    if (!league || !season) {
      res.status(400).json({ success: false, message: 'league y season son requeridos' });
      return;
    }
    const standings = await getStandings(Number(league), Number(season));
    res.json({ success: true, data: standings });
  } catch {
    res.status(500).json({ success: false, message: 'Error obteniendo standings' });
  }
});

router.get('/match/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const match = await getMatchDetail(Number(req.params.id));
    res.json({ success: true, data: match });
  } catch {
    res.status(500).json({ success: false, message: 'Error obteniendo detalle del partido' });
  }
});

export default router;