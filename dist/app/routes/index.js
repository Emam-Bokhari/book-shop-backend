"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const product_route_1 = require("../modules/Product/product.route");
const order_route_1 = require("../modules/Order/order.route");
const shippingAddress_route_1 = require("../modules/ShippingAddress/shippingAddress.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const support_route_1 = require("../modules/Support/support.route");
const contact_route_1 = require("../modules/Contact/contact.route");
const blog_route_1 = require("../modules/Blog/blog.route");
const newsletter_route_1 = require("../modules/Newsletter/newsletter.route");
const analytics_route_1 = require("../modules/Analytics/analytics.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/products',
        route: product_route_1.ProductRoutes,
    },
    {
        path: '/orders',
        route: order_route_1.OrderRoutes,
    },
    {
        path: '/payments',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/shipping-address',
        route: shippingAddress_route_1.ShippingAddressRoutes,
    },
    {
        path: '/supports',
        route: support_route_1.SupportRoutes,
    },
    {
        path: '/contacts',
        route: contact_route_1.ContactRoutes,
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogRoutes,
    },
    {
        path: '/newsletters',
        route: newsletter_route_1.NewsletterRoutes,
    },
    {
        path: '/analytics',
        route: analytics_route_1.AnalyticsRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
