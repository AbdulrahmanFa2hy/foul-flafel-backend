"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const payment_types_1 = require("./payment.types");
const paymentSchema = new mongoose_1.Schema({
    shiftId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Shift',
        required: true
    },
    cashierId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentMethods: [
        {
            method: {
                type: String,
                enum: Object.values(payment_types_1.PaymentMethod),
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ],
    discount: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
paymentSchema.virtual('orderData', {
    ref: 'Order',
    localField: 'orderId',
    foreignField: '_id',
    justOne: true,
    autopopulate: true
});
paymentSchema.virtual('cashierData', {
    ref: 'User',
    localField: 'cashierId',
    foreignField: '_id',
    justOne: true,
    autopopulate: true
});
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
