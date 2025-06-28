"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stockOutFlowSchema = new mongoose_1.default.Schema({
    stockItemId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    orderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    quantityUsed: {
        type: Number,
        required: true,
        min: 0.01
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('StockOutflow', stockOutFlowSchema);
