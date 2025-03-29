"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_constant_1 = require("../User/user.constant");
const validateRequestSchema_1 = require("../../middlewares/validateRequestSchema");
const support_validation_1 = require("./support.validation");
const support_controller_1 = require("./support.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post('/', (0, auth_1.auth)(user_constant_1.USER_ROLE.user), (0, validateRequestSchema_1.validateRequestSchema)(support_validation_1.SupportValidationSchema.createSupportValidationSchema), support_controller_1.SupportControllers.createSupportController);
router.get('/', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), support_controller_1.SupportControllers.getAllSupportsController);
router.get('/:id', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), support_controller_1.SupportControllers.getSupportController);
router.delete('/:id', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), support_controller_1.SupportControllers.deleteSupportController);
exports.SupportRoutes = router;
