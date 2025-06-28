"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByCodeSchema = exports.getAllOrdersSchema = exports.deleteMealFromOrderSchema = exports.addMealToOrderSchema = exports.createOrderSchema = exports.orderItemSchema = void 0;
const zod_1 = require("zod");
const general_1 = require("../../utils/general");
const order_types_1 = require("./order.types");
exports.orderItemSchema = zod_1.z.object({
    mealId: zod_1.z.string().regex(general_1.MONGODBObjectId, "invalid meal id"),
    quantity: zod_1.z.number().min(0.01).default(1).optional(),
    note: zod_1.z.string().optional(),
});
exports.createOrderSchema = zod_1.z
    .object({
    custName: zod_1.z.string().optional(),
    custPhone: zod_1.z.string().optional(),
    custAddress: zod_1.z.string().optional(),
    type: zod_1.z.nativeEnum(order_types_1.OrderTypesEnum),
    tableNumber: zod_1.z.number().positive().int().optional(),
    orderItems: zod_1.z.array(zod_1.z.object({
        mealId: zod_1.z.string().regex(general_1.MONGODBObjectId, "invalid meal id"),
        quantity: zod_1.z.number().positive().min(0.01),
        note: zod_1.z.string().optional(),
    })),
})
    .refine((data) => {
    if (data.type === order_types_1.OrderTypesEnum.DELIVERY) {
        return !!data.custName && !!data.custAddress && !!data.custPhone;
    }
    return true; // for takeaway orders,customer details are optional
}, {
    message: "Customer name/address/phone is required",
});
exports.addMealToOrderSchema = exports.orderItemSchema;
exports.deleteMealFromOrderSchema = zod_1.z.object({
    mealId: zod_1.z.string().regex(general_1.MONGODBObjectId, "invalid meal id"),
});
exports.getAllOrdersSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    size: zod_1.z.coerce.number().max(100).default(20),
    date: zod_1.z.coerce.date().optional(),
    cashierId: zod_1.z.string().regex(general_1.MONGODBObjectId, "invalid cashier id").optional(),
    shiftId: zod_1.z.string().regex(general_1.MONGODBObjectId, "invalid shift id").optional(),
});
exports.getOrderByCodeSchema = zod_1.z.object({
    orderCode: zod_1.z.string().regex(/^ORD-\d{7}$/, "invalid order code"),
});
