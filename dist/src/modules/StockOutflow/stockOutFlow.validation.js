"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStockOutFlowSchema = exports.updateStockOutFlowSchema = exports.getStockOutFlowSchema = exports.addStockOutFlowSchema = void 0;
const zod_1 = require("zod");
exports.addStockOutFlowSchema = zod_1.z.object({
    stockItemId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid stock item id'),
    orderId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid order id'),
    quantityUsed: zod_1.z.number().positive(),
    date: zod_1.z.string().datetime()
});
exports.getStockOutFlowSchema = zod_1.z.object({
    managerId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id')
});
exports.updateStockOutFlowSchema = zod_1.z.object({
    stockItemId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid stock item id').optional(),
    orderId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid order id').optional(),
    quantityUsed: zod_1.z.number().positive().optional(),
    date: zod_1.z.string().datetime().optional()
});
exports.deleteStockOutFlowSchema = zod_1.z.object({
    managerId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id')
});
