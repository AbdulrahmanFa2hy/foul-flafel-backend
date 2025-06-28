"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_middleware_1 = __importDefault(require("./middleware/errors.middleware"));
const apiErrors_1 = __importDefault(require("./utils/apiErrors"));
const users_route_1 = __importDefault(require("./modules/User/users.route"));
const auth_router_1 = __importDefault(require("./modules/Auth/auth.router"));
const meal_route_1 = __importDefault(require("./modules/Meal/meal.route"));
const Order_1 = require("./modules/Order");
const Payment_1 = require("./modules/Payment");
const stock_routes_1 = __importDefault(require("./modules/Stock/stock.routes"));
const stockOutFlow_routes_1 = __importDefault(require("./modules/StockOutflow/stockOutFlow.routes"));
const shift_routes_1 = require("./modules/Shift/shift.routes");
const category_routes_1 = __importDefault(require("./modules/Category/category.routes"));
const Table_1 = require("./modules/Table");
const Routes = (app) => {
    app.use('/api/v1/users', users_route_1.default);
    app.use('/api/v1/auth', auth_router_1.default);
    app.use('/api/v1/meals', meal_route_1.default);
    app.use('/api/v1/order', Order_1.orderRouter);
    app.use('/api/v1/payment', Payment_1.paymentRouter);
    app.use('/api/v1/stock', stock_routes_1.default);
    app.use('/api/v1/stockOutFlow', stockOutFlow_routes_1.default);
    app.use('/api/v1/shift', shift_routes_1.shiftRouter);
    app.use('/api/v1/category', category_routes_1.default);
    app.use('/api/v1/table', Table_1.tableRoutes);
    app.all('*', (req, res, next) => {
        next(new apiErrors_1.default(`Route ${req.originalUrl} not found`, 404));
    });
    app.use(errors_middleware_1.default);
};
exports.default = Routes;
