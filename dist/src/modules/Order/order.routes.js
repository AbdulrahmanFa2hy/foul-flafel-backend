"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
const odrer_controller_1 = require("./odrer.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const users_interface_1 = require("../User/users.interface");
const router = (0, express_1.Router)();
router.route('/')
    .post((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.CASHIER, users_interface_1.UserRoles.MANAGER]), (0, express_async_handler_1.default)(odrer_controller_1.orderCtrl.createOrder))
    .get((0, auth_middleware_1.isAuthenticated)([
    users_interface_1.UserRoles.MANAGER,
    users_interface_1.UserRoles.CASHIER,
]), (0, express_async_handler_1.default)(odrer_controller_1.orderCtrl.getAllOrders));
router.route('/:id')
    .patch((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.CASHIER, users_interface_1.UserRoles.MANAGER]), (0, express_async_handler_1.default)(odrer_controller_1.orderCtrl.addMealToOrder))
    .delete((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER, users_interface_1.UserRoles.CASHIER]), (0, express_async_handler_1.default)(odrer_controller_1.orderCtrl.deleteMealFromOrder)).get((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.CASHIER, users_interface_1.UserRoles.MANAGER]), (0, express_async_handler_1.default)(odrer_controller_1.orderCtrl.getOrderById));
router.patch('/:id/cancel', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER, users_interface_1.UserRoles.CASHIER]), (0, express_async_handler_1.default)(odrer_controller_1.orderCtrl.cancelOrder));
router.get('/get-by-code/:orderCode', (0, auth_middleware_1.isAuthenticated)([
    users_interface_1.UserRoles.MANAGER,
    users_interface_1.UserRoles.CASHIER,
]), (0, express_async_handler_1.default)(odrer_controller_1.orderCtrl.getOrderByCode));
exports.orderRouter = router;
