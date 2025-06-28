"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = require("express");
const users_interface_1 = require("../User/users.interface");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const payment_controller_1 = require("./payment.controller");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.CASHIER]), (0, express_async_handler_1.default)(payment_controller_1.paymentCtrl.createPayment))
    .get((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), (0, express_async_handler_1.default)(payment_controller_1.paymentCtrl.getAllPayments));
router
    .route('/:id')
    .get((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), (0, express_async_handler_1.default)(payment_controller_1.paymentCtrl.getPaymentById));
exports.paymentRouter = router;
