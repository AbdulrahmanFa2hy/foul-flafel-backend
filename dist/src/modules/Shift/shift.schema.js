"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shift = void 0;
const mongoose_1 = require("mongoose");
const shiftSchema = new mongoose_1.Schema({
    cashierId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startBalance: {
        type: Number,
        required: true
    },
    endBalance: {
        type: Number,
    },
    allOrdersCount: {
        type: Number,
        default: 0
    },
    notPaidOrdersCount: {
        type: Number,
        default: 0
    },
    cancelledOrdersCount: {
        type: Number,
        default: 0
    },
    paymentWithCashBalance: {
        type: Number,
        default: 0,
    },
    paymentWithVisaBalance: {
        type: Number,
        default: 0
    },
    soldItemsCount: {
        type: Number,
        default: 0
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    cancelledAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
shiftSchema.virtual('cashierData', {
    ref: 'User',
    localField: 'cashierId',
    foreignField: '_id',
    justOne: true,
    autopopulate: true,
    options: {
        select: "name username image"
    }
});
exports.Shift = (0, mongoose_1.model)('Shift', shiftSchema);
