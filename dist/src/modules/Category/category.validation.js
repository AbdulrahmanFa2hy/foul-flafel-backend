"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategorySchema = exports.updateCategorySchema = exports.getCategorySchema = exports.addCategorySchema = void 0;
const zod_1 = require("zod");
exports.addCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().min(3).max(500).optional(),
    color: zod_1.z.string().max(100).optional(),
    date: zod_1.z.string().datetime().optional()
});
exports.getCategorySchema = zod_1.z.object({
    managerId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id')
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100).optional(),
    description: zod_1.z.string().min(3).max(500).optional(),
    color: zod_1.z.string().max(100).optional(),
    date: zod_1.z.string().datetime().optional()
});
exports.deleteCategorySchema = zod_1.z.object({
    managerId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id')
});
