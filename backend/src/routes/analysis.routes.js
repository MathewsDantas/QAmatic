import { Router } from 'express';
import { startAnalysis, getAnalysis } from '../controllers/analysis.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/start', authenticate, startAnalysis);
router.get('/:id', authenticate, getAnalysis);

export default router;
