import { Router } from 'express';
import { startAnalysis, getAnalysis, listAnalyses, getStats } from '../controllers/analysis.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/start', authenticate, startAnalysis);
router.get('/', authenticate, listAnalyses);
router.get('/stats', authenticate, getStats);
router.get('/:id', authenticate, getAnalysis);

export default router;
