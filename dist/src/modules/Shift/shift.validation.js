"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllShiftsSchema = exports.endShiftSchema = exports.startShiftSchema = void 0;
const zod_1 = require("zod");
const general_1 = require("../../utils/general");
exports.startShiftSchema = zod_1.z.object({
    startBalance: zod_1.z.number().int().positive()
});
exports.endShiftSchema = zod_1.z.object({
    endBalance: zod_1.z.number().int().positive()
});
exports.getAllShiftsSchema = zod_1.z.object({
    cashierId: zod_1.z
        .string()
        .refine(general_1.validateMongoDBId, { message: "Invalid MongoDB ID" })
        .optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    size: zod_1.z.coerce.number().int().positive().max(100).default(20),
    includeAll: zod_1.z.coerce.boolean().optional().default(false),
});
