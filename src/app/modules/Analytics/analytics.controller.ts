import { asyncHandler } from '../../utils/global/asyncHandler';
import { sendResponse } from '../../utils/global/sendResponse';
import { AnalyticsServices } from './analytics.service';

const getStatsController = asyncHandler(async (req, res) => {
  const stats = await AnalyticsServices.getStats();
  sendResponse(res, {
    success: true,
    message: 'Stats data retrieved successfully',
    statusCode: 200,
    data: stats,
  });
});

const getDashboardOverviewController = asyncHandler(async (req, res) => {
  const overview = await AnalyticsServices.getDashboardOverview();
  sendResponse(res, {
    success: true,
    message: 'Dashboard overview data retrieved successfully',
    statusCode: 200,
    data: overview,
  });
});

const getOrderStatusDistributionController = asyncHandler(async (req, res) => {
  const distribution = await AnalyticsServices.getOrderStatusDistribution();
  sendResponse(res, {
    success: true,
    message: 'Order status distribution retrieved successfully',
    statusCode: 200,
    data: distribution,
  });
});

const getSalesByCategoryController = asyncHandler(async (req, res) => {
  const categorySales = await AnalyticsServices.getSalesByCategory();
  sendResponse(res, {
    success: true,
    message: 'Category sales data retrieved successfully',
    statusCode: 200,
    data: categorySales,
  });
});

const getMonthlySalesTrendController = asyncHandler(async (req, res) => {
  const trend = await AnalyticsServices.getMonthlySalesTrend();
  sendResponse(res, {
    success: true,
    message: 'Monthly sales trend retrieved successfully',
    statusCode: 200,
    data: trend,
  });
});

const getPaymentStatusDistributionController = asyncHandler(
  async (req, res) => {
    const paymentStatus =
      await AnalyticsServices.getPaymentStatusDistribution();
    sendResponse(res, {
      success: true,
      message: 'Payment status distribution retrieved successfully',
      statusCode: 200,
      data: paymentStatus,
    });
  },
);

const getTopSellingBooksController = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const topBooks = await AnalyticsServices.getTopSellingBooks(limit);
  sendResponse(res, {
    success: true,
    message: 'Top selling books retrieved successfully',
    statusCode: 200,
    data: topBooks,
  });
});

const getRecentOrdersController = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const orders = await AnalyticsServices.getRecentOrders(limit);
  sendResponse(res, {
    success: true,
    message: 'Recent orders retrieved successfully',
    statusCode: 200,
    data: orders,
  });
});

const getInventoryAlertsController = asyncHandler(async (req, res) => {
  const threshold = req.query.threshold ? Number(req.query.threshold) : 10;
  const alerts = await AnalyticsServices.getInventoryAlerts(threshold);
  sendResponse(res, {
    success: true,
    message: 'Inventory alerts retrieved successfully',
    statusCode: 200,
    data: alerts,
  });
});

export const AnalyticsControllers = {
  getStatsController,
  getDashboardOverviewController,
  getOrderStatusDistributionController,
  getSalesByCategoryController,
  getMonthlySalesTrendController,
  getPaymentStatusDistributionController,
  getTopSellingBooksController,
  getRecentOrdersController,
  getInventoryAlertsController,
};
