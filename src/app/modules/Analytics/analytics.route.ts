import express from 'express';
import { AnalyticsControllers } from './analytics.controller';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();


router.get(
  '/overview',
  auth(USER_ROLE.admin),
  AnalyticsControllers.getDashboardOverviewController,
);


router.get(
  '/getStats',
  auth(USER_ROLE.admin),
  AnalyticsControllers.getStatsController,
);


router.get(
  '/order-status-distribution',
  auth(USER_ROLE.admin),
  AnalyticsControllers.getOrderStatusDistributionController,
);


router.get(
  '/sales-by-category',
  auth(USER_ROLE.admin),
  AnalyticsControllers.getSalesByCategoryController,
);


router.get(
  '/monthly-sales-trend',
  auth(USER_ROLE.admin),
  AnalyticsControllers.getMonthlySalesTrendController,
);


router.get(
  '/payment-status-distribution',
  auth(USER_ROLE.admin),
  AnalyticsControllers.getPaymentStatusDistributionController,
);


router.get(
  '/top-selling-books',
  auth(USER_ROLE.admin),
  AnalyticsControllers.getTopSellingBooksController,
);


router.get(
  '/recent-orders',
  auth(USER_ROLE.admin),
  AnalyticsControllers.getRecentOrdersController,
);


router.get(
  '/inventory-alert',
  auth(USER_ROLE.admin),
  AnalyticsControllers.getInventoryAlertsController,
);

export const AnalyticsRoutes = router;
