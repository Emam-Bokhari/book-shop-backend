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
exports.AnalyticsServices = void 0;
const order_model_1 = require("../Order/order.model");
const product_model_1 = require("../Product/product.model");
const user_model_1 = require("../User/user.model");
const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
const getStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalOrders = yield order_model_1.Order.countDocuments();
    const totalSales = yield order_model_1.Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalUsers = yield user_model_1.User.countDocuments({ isDeleted: false });
    const totalProducts = yield product_model_1.Product.countDocuments({ isDeleted: false });
    const pendingOrders = yield order_model_1.Order.countDocuments({ status: 'pending' });
    const deliveredOrders = yield order_model_1.Order.countDocuments({ status: 'delivered' });
    const lowStockProducts = yield product_model_1.Product.countDocuments({
        isDeleted: false,
        quantity: { $lte: 5 },
    });
    return {
        totalOrders,
        totalSales: ((_a = totalSales[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        totalUsers,
        totalProducts,
        pendingOrders,
        deliveredOrders,
        lowStockProducts,
    };
});
const getOrderStatusDistribution = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalOrders = yield order_model_1.Order.countDocuments();
    const statusData = yield order_model_1.Order.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalAmount' },
            },
        },
        {
            $project: {
                _id: 0,
                status: '$_id',
                count: 1,
                totalAmount: { $round: ['$totalAmount', 2] },
                percentage: {
                    $cond: [
                        { $eq: [totalOrders, 0] },
                        0,
                        {
                            $round: [
                                { $multiply: [{ $divide: ['$count', totalOrders] }, 100] },
                                1,
                            ],
                        },
                    ],
                },
            },
        },
        { $sort: { count: -1 } },
    ]);
    return statusData;
});
const getSalesByCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const categorySales = yield order_model_1.Order.aggregate([
        { $unwind: '$products' },
        {
            $lookup: {
                from: 'products',
                localField: 'products.productId',
                foreignField: '_id',
                as: 'productDetails',
            },
        },
        { $unwind: '$productDetails' },
        {
            $group: {
                _id: '$productDetails.category',
                totalQuantitySold: { $sum: '$products.quantity' },
                totalRevenue: {
                    $sum: {
                        $multiply: ['$products.quantity', '$productDetails.price'],
                    },
                },
                orderCount: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                category: '$_id',
                totalQuantitySold: 1,
                totalRevenue: { $round: ['$totalRevenue', 2] },
                orderCount: 1,
            },
        },
        { $sort: { totalRevenue: -1 } },
    ]);
    return categorySales;
});
const getMonthlySalesTrend = () => __awaiter(void 0, void 0, void 0, function* () {
    const trend = yield order_model_1.Order.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: { $ifNull: ['$orderDate', '$createdAt'] } },
                    month: { $month: { $ifNull: ['$orderDate', '$createdAt'] } },
                },
                totalSales: { $sum: '$totalAmount' },
                orderCount: { $sum: 1 },
            },
        },
        {
            $sort: {
                '_id.year': 1,
                '_id.month': 1,
            },
        },
        {
            $project: {
                _id: 0,
                year: '$_id.year',
                month: '$_id.month',
                totalSales: { $round: ['$totalSales', 2] },
                orderCount: 1,
            },
        },
    ]);
    const formattedTrend = trend.map((item) => ({
        year: item.year,
        month: monthNames[item.month - 1] || `${item.month}`,
        monthKey: `${item.year}-${String(item.month).padStart(2, '0')}`,
        label: `${monthNames[item.month - 1]} ${item.year}`,
        totalSales: item.totalSales,
        orderCount: item.orderCount,
    }));
    return formattedTrend;
});
const getPaymentStatusDistribution = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalOrders = yield order_model_1.Order.countDocuments();
    const paymentData = yield order_model_1.Order.aggregate([
        {
            $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalAmount' },
            },
        },
        {
            $project: {
                _id: 0,
                paymentStatus: '$_id',
                count: 1,
                totalAmount: { $round: ['$totalAmount', 2] },
                percentage: {
                    $cond: [
                        { $eq: [totalOrders, 0] },
                        0,
                        {
                            $round: [
                                { $multiply: [{ $divide: ['$count', totalOrders] }, 100] },
                                1,
                            ],
                        },
                    ],
                },
            },
        },
        { $sort: { count: -1 } },
    ]);
    return paymentData;
});
const getTopSellingBooks = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 10) {
    const topBooks = yield order_model_1.Order.aggregate([
        { $unwind: '$products' },
        {
            $group: {
                _id: '$products.productId',
                totalSold: { $sum: '$products.quantity' },
            },
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'book',
            },
        },
        { $unwind: '$book' },
        {
            $project: {
                _id: 0,
                productId: '$_id',
                title: '$book.title',
                author: '$book.author',
                category: '$book.category',
                price: '$book.price',
                image: { $arrayElemAt: ['$book.images', 0] },
                currentStock: '$book.quantity',
                totalSold: 1,
                totalRevenue: {
                    $round: [{ $multiply: ['$totalSold', '$book.price'] }, 2],
                },
            },
        },
    ]);
    return topBooks;
});
const getRecentOrders = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 10) {
    const recentOrders = yield order_model_1.Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email')
        .lean();
    const formattedOrders = recentOrders.map((order) => {
        var _a, _b, _c;
        const user = order.userId;
        const totalItems = ((_a = order.products) === null || _a === void 0 ? void 0 : _a.reduce((sum, p) => sum + (p.quantity || 1), 0)) || 0;
        return {
            orderId: order._id,
            transactionId: order.transactionId || 'N/A',
            customerName: (user === null || user === void 0 ? void 0 : user.name) || ((_b = order.shippingAddressDetails) === null || _b === void 0 ? void 0 : _b.name) || 'Customer',
            customerEmail: (user === null || user === void 0 ? void 0 : user.email) || 'N/A',
            city: ((_c = order.shippingAddressDetails) === null || _c === void 0 ? void 0 : _c.city) || 'N/A',
            totalItems,
            totalAmount: order.totalAmount || 0,
            paymentMethod: order.paymentMethod || 'SSLCommerz',
            paymentStatus: order.paymentStatus || 'pending',
            orderStatus: order.status || 'pending',
            createdAt: order.createdAt || order.orderDate,
        };
    });
    return formattedOrders;
});
const getInventoryAlerts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (threshold = 10) {
    const lowStockProducts = yield product_model_1.Product.find({
        isDeleted: false,
        quantity: { $lte: threshold },
    })
        .select('title author category price quantity images')
        .sort({ quantity: 1 })
        .limit(10)
        .lean();
    const formattedAlerts = lowStockProducts.map((product) => {
        var _a;
        return ({
            productId: product._id,
            title: product.title,
            author: product.author,
            category: product.category,
            price: product.price,
            currentStock: product.quantity,
            image: ((_a = product.images) === null || _a === void 0 ? void 0 : _a[0]) || null,
            stockStatus: product.quantity === 0 ? 'Out of Stock' : 'Low Stock',
        });
    });
    return formattedAlerts;
});
const getDashboardOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    const [stats, orderStatusDistribution, salesByCategory, monthlySalesTrend, paymentStatusDistribution, topSellingBooks, recentOrders, inventoryAlerts,] = yield Promise.all([
        getStats(),
        getOrderStatusDistribution(),
        getSalesByCategory(),
        getMonthlySalesTrend(),
        getPaymentStatusDistribution(),
        getTopSellingBooks(5),
        getRecentOrders(5),
        getInventoryAlerts(5),
    ]);
    return {
        stats,
        charts: {
            orderStatusDistribution,
            salesByCategory,
            monthlySalesTrend,
            paymentStatusDistribution,
        },
        tables: {
            topSellingBooks,
            recentOrders,
            inventoryAlerts,
        },
    };
});
exports.AnalyticsServices = {
    getStats,
    getOrderStatusDistribution,
    getSalesByCategory,
    getMonthlySalesTrend,
    getPaymentStatusDistribution,
    getTopSellingBooks,
    getRecentOrders,
    getInventoryAlerts,
    getDashboardOverview,
};
