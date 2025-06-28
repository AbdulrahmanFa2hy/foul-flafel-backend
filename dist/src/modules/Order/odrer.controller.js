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
exports.orderCtrl = void 0;
const order_validation_1 = require("./order.validation");
const order_service_1 = require("./order.service");
const general_1 = require("../../utils/general");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const cashierId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const shiftId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.shiftId;
    const data = order_validation_1.createOrderSchema.parse(req.body);
    const order = yield order_service_1.orderService.createOrder(Object.assign(Object.assign({}, data), { shiftId, cashierId }));
    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
    });
});
const addMealToOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: orderId } = general_1.params.parse(req.params);
    const { mealId, quantity } = order_validation_1.addMealToOrderSchema.parse(req.body);
    const validatedQuantity = Number(quantity);
    const order = yield order_service_1.orderService.addMealToOrder({ orderId, orderItem: { mealId, quantity: validatedQuantity } });
    res.status(200).json({
        success: true,
        message: 'Meal added to order successfully',
        data: order
    });
});
const deleteMealFromOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: orderId } = general_1.params.parse(req.params);
    const { mealId } = order_validation_1.deleteMealFromOrderSchema.parse(req.body);
    const order = yield order_service_1.orderService.deleteMealFromOrder({ orderId, mealId });
    res.status(200).json({
        success: true,
        message: 'Meal deleted from order successfully',
        data: order
    });
});
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, date, cashierId, shiftId } = order_validation_1.getAllOrdersSchema.parse(req.query);
    const allOrders = yield order_service_1.orderService.getAllOrders({ page, size, date, cashierId, shiftId });
    res.status(201).json({
        success: true,
        message: 'Orders fetched successfully',
        data: allOrders
    });
});
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: orderId } = general_1.params.parse(req.params);
    const order = yield order_service_1.orderService.cancelOrder(orderId);
    res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
    });
});
// const completeOrder = 
//   async (req: Request, res: Response ,next : NextFunction) => {
//     const order = await orderService.completeOrder(req.params.id);
//     if(!order) {
//       return next(new ApiError(`${req.__('not_found')}`,404));
//     }
//     res.status(200).json({
//       success: true,
//       message: 'Order completed successfully',
//       data: order
//     });
//   }
const getOrderByCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderCode } = order_validation_1.getOrderByCodeSchema.parse(req.params);
    const order = yield order_service_1.orderService.getOrderByCode(orderCode);
    res.status(200).json({
        success: true,
        message: 'Order fetched successfully',
        data: order
    });
});
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: orderId } = general_1.params.parse(req.params);
    const order = yield order_service_1.orderService.getOrderById(orderId);
    res.status(200).json({
        success: true,
        message: 'Order fetched successfully',
        data: order
    });
});
exports.orderCtrl = {
    createOrder,
    addMealToOrder,
    deleteMealFromOrder,
    getAllOrders,
    cancelOrder,
    getOrderByCode,
    getOrderById
};
