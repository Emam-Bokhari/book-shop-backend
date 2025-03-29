import express from 'express';
import { AnalyticsControllers } from './analytics.controller';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.get(
  '/getStats',
  auth(USER_ROLE.admin),
  AnalyticsControllers.getStatsController,
);

export const AnalyticsRoutes = router;
