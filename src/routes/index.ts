import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import storeRoutes from './store.routes';
import vehicleRoutes from './vehicle.routes';
import rentalRoutes from './rental.routes';
import paymentRoutes from './payment.routes';
import env from '../config/env';

const router = Router();

router.use(`${env.API_PREFIX}/auth`, authRoutes);
router.use(`${env.API_PREFIX}/users`, userRoutes);
router.use(`${env.API_PREFIX}/stores`, storeRoutes);
router.use(`${env.API_PREFIX}/vehicles`, vehicleRoutes);
router.use(`${env.API_PREFIX}/rentals`, rentalRoutes);
router.use(`${env.API_PREFIX}/payments`, paymentRoutes);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;

