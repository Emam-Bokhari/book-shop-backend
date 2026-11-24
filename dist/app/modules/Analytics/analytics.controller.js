"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsControllers = void 0;
const asyncHandler_1 = require("../../utils/global/asyncHandler");
const sendResponse_1 = require("../../utils/global/sendResponse");
const analytics_service_1 = require("./analytics.service");
const getStatsController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield analytics_service_1.AnalyticsServices.getStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Stats data retrieved successfully',
        statusCode: 200,
        data: stats,
    });
}));
const getDashboardOverviewController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const overview = yield analytics_service_1.AnalyticsServices.getDashboardOverview();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Dashboard overview data retrieved successfully',
        statusCode: 200,
        data: overview,
    });
}));
const getOrderStatusDistributionController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const distribution = yield analytics_service_1.AnalyticsServices.getOrderStatusDistribution();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Order status distribution retrieved successfully',
        statusCode: 200,
        data: distribution,
    });
}));
const getSalesByCategoryController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categorySales = yield analytics_service_1.AnalyticsServices.getSalesByCategory();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Category sales data retrieved successfully',
        statusCode: 200,
        data: categorySales,
    });
}));
const getMonthlySalesTrendController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trend = yield analytics_service_1.AnalyticsServices.getMonthlySalesTrend();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Monthly sales trend retrieved successfully',
        statusCode: 200,
        data: trend,
    });
}));
const getPaymentStatusDistributionController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentStatus = yield analytics_service_1.AnalyticsServices.getPaymentStatusDistribution();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Payment status distribution retrieved successfully',
        statusCode: 200,
        data: paymentStatus,
    });
}));
const getTopSellingBooksController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const topBooks = yield analytics_service_1.AnalyticsServices.getTopSellingBooks(limit);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Top selling books retrieved successfully',
        statusCode: 200,
        data: topBooks,
    });
}));
const getRecentOrdersController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const orders = yield analytics_service_1.AnalyticsServices.getRecentOrders(limit);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Recent orders retrieved successfully',
        statusCode: 200,
        data: orders,
    });
}));
const getInventoryAlertsController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const threshold = req.query.threshold ? Number(req.query.threshold) : 10;
    const alerts = yield analytics_service_1.AnalyticsServices.getInventoryAlerts(threshold);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Inventory alerts retrieved successfully',
        statusCode: 200,
        data: alerts,
    });
}));
exports.AnalyticsControllers = {
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
