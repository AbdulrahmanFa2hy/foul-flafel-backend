"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const mongoose_1 = require("mongoose");
const table_types_1 = require("./table.types");
const tableSchema = new mongoose_1.Schema({
    number: {
        type: Number,
        unique: true,
        index: true,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    location: {
        type: String,
        enum: Object.values(table_types_1.TableLocations),
        required: true
    }
}, {
    timestamps: true
});
exports.Table = (0, mongoose_1.model)('Table', tableSchema);
