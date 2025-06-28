"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftRouter = void 0;
const express_1 = require("express");
const users_interface_1 = require("../User/users.interface");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const shift_controller_1 = require("./shift.controller");
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.CASHIER], false), (0, express_async_handler_1.default)(shift_controller_1.shiftCtrl.startShift))
    .patch((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.CASHIER]), (0, express_async_handler_1.default)(shift_controller_1.shiftCtrl.endShift))
    .get((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.CASHIER, users_interface_1.UserRoles.MANAGER]), (0, express_async_handler_1.default)(shift_controller_1.shiftCtrl.getAllShifts));
router
    .route('/:id')
    .get((0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER, users_interface_1.UserRoles.CASHIER]), (0, express_async_handler_1.default)(shift_controller_1.shiftCtrl.getShiftById));
exports.shiftRouter = router;
