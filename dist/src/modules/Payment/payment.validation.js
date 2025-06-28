"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPaymentsSchema = exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
const general_1 = require("../../utils/general");
const payment_types_1 = require("./payment.types");
exports.createPaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string().regex(general_1.MONGODBObjectId, "invalid order id"),
    paymentMethods: zod_1.z.array(zod_1.z.object({
        method: zod_1.z.nativeEnum(payment_types_1.PaymentMethod),
        amount: zod_1.z.number().min(0),
    })),
    discount: zod_1.z.number().min(0).max(20).int().optional(),
    tax: zod_1.z.number().min(0).int().optional(),
});
exports.getAllPaymentsSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    size: zod_1.z.coerce.number().min(1).max(100).default(20),
    paymentMethod: zod_1.z.nativeEnum(payment_types_1.PaymentMethod).optional(),
    date: zod_1.z.coerce.date().optional(),
    shiftId: zod_1.z.string().regex(general_1.MONGODBObjectId, "invalid shift id").optional(),
    cashierId: zod_1.z.string().regex(general_1.MONGODBObjectId, "invalid cashier id").optional(),
    search: zod_1.z.string().optional(),
});
