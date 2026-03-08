import { Router } from 'express';
import authRoutes from './auth.routes.js';
import analysisRoutes from './analysis.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/analysis', analysisRoutes);

export default router;
