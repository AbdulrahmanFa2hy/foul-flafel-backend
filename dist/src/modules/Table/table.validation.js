"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableByNumberSchema = exports.getAllTablesSchema = exports.updateTableSchema = exports.addTableSchema = void 0;
const zod_1 = require("zod");
const table_types_1 = require("./table.types");
exports.addTableSchema = zod_1.z.object({
    number: zod_1.z.number().positive().int(),
    location: zod_1.z.nativeEnum(table_types_1.TableLocations)
});
exports.updateTableSchema = zod_1.z.object({
    number: zod_1.z.number().positive().int().optional(),
    location: zod_1.z.nativeEnum(table_types_1.TableLocations).optional()
});
exports.getAllTablesSchema = zod_1.z.object({
    location: zod_1.z.nativeEnum(table_types_1.TableLocations).optional(),
    isAvailable: zod_1.z.enum(['true', 'false']).transform(val => val === 'true').optional()
});
exports.getTableByNumberSchema = zod_1.z.object({
    tableNumber: zod_1.z.coerce.number().positive().int()
});
