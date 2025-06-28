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
exports.paymentCtrl = void 0;
const payment_validation_1 = require("./payment.validation");
const payment_service_1 = require("./payment.service");
const general_1 = require("../../utils/general");
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const cashierId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const shiftId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.shiftId;
    const data = payment_validation_1.createPaymentSchema.parse(req.body);
    const payment = yield payment_service_1.paymentService.createPayment(Object.assign(Object.assign({}, data), { shiftId, cashierId }));
    res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
    });
});
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = payment_validation_1.getAllPaymentsSchema.parse(req.query);
    const allPayments = yield payment_service_1.paymentService.getAllPayments(query);
    res.status(200).json({
        success: true,
        message: 'Payments fetched successfully',
        data: allPayments
    });
});
const getPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: paymentId } = general_1.params.parse(req.params);
    const payment = yield payment_service_1.paymentService.getPaymentById(paymentId);
    res.status(200).json({
        success: true,
        message: 'Payment fetched successfully',
        data: payment
    });
});
exports.paymentCtrl = {
    createPayment,
    getAllPayments,
    getPaymentById
};
