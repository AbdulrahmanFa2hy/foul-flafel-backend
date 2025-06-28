"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockSchema = exports.deleteStockSchema = exports.updateStockSchema = exports.addStockSchema = void 0;
const zod_1 = require("zod");
exports.addStockSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    supplierName: zod_1.z.string().min(3).max(100),
    quantity: zod_1.z.number().positive(),
    pricePerUnit: zod_1.z.number().positive(),
    minimumQuantity: zod_1.z.number().positive(),
    managerId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id'),
    date: zod_1.z.string().datetime().optional(),
    // status: z.string().min(3).max(100),
    unit: zod_1.z.enum(['pcs', 'ml', 'grams', 'kg', 'liters', 'cans', 'cups', 'tsp', 'tbsp', 'packets', 'boxes']).default('pcs'),
    invoice: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(['Cash', 'Postponed']),
        value: zod_1.z.number().positive(),
        residualValue: zod_1.z.number().nonnegative(), // يسمح بالقيم 0 وما فوق
    }))
});
exports.updateStockSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100).optional(),
    supplierName: zod_1.z.string().min(3).max(100).optional(),
    quantity: zod_1.z.number().positive().optional(),
    pricePerUnit: zod_1.z.number().positive().optional(),
    // status: z.string().min(3).max(100).optional(),  
    minimumQuantity: zod_1.z.number().positive().optional(),
    managerId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id').optional(),
    date: zod_1.z.string().datetime().optional(),
    unit: zod_1.z.enum(['pcs', 'ml', 'grams', 'kg', 'liters', 'cans', 'cups', 'tsp', 'tbsp', 'packets', 'boxes']).optional(),
    invoice: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(['Cash', 'Postponed']),
        value: zod_1.z.number().positive(),
        residualValue: zod_1.z.number().nonnegative(), // يسمح بالقيم 0 وما فوق
    })).optional()
});
exports.deleteStockSchema = zod_1.z.object({
    managerId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id')
});
exports.getStockSchema = zod_1.z.object({
    managerId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id')
});
