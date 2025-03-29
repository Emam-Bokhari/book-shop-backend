"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_constant_1 = require("../User/user.constant");
const validateRequestSchema_1 = require("../../middlewares/validateRequestSchema");
const newsletter_validation_1 = require("./newsletter.validation");
const newsletter_controller_1 = require("./newsletter.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post('/', (0, validateRequestSchema_1.validateRequestSchema)(newsletter_validation_1.NewsletterValidationSchema.createNewsletterValidationSchema), newsletter_controller_1.NewsLetterControllers.createNewsletterController);
router.get('/', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), newsletter_controller_1.NewsLetterControllers.getAllNewslettersController);
router.delete('/:id', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), newsletter_controller_1.NewsLetterControllers.deleteNewsletterController);
exports.NewsletterRoutes = router;
