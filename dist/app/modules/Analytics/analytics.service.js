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
const getStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalOrders = yield order_model_1.Order.countDocuments();
    const totalSales = yield order_model_1.Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalUsers = yield user_model_1.User.countDocuments({ isDeleted: false });
    const totalProducts = yield product_model_1.Product.countDocuments({ isDeleted: false });
    return {
        totalOrders,
        totalSales: ((_a = totalSales[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        totalUsers,
        totalProducts,
    };
});
exports.AnalyticsServices = {
    getStats,
};
