"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const order_types_1 = require("./order.types");
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const orderSchema = new mongoose_1.Schema({
    cashierId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    shiftId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shift",
        required: true,
    },
    orderCode: {
        type: String,
    },
    orderItems: [
        {
            mealId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Meal",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 0.01,
            },
            price: {
                type: Number,
                required: true,
            },
            isCancelled: {
                type: Boolean,
                default: false,
            },
            note: {
                type: String,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    isCancelled: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        enum: Object.values(order_types_1.OrderTypesEnum),
    },
    tableNumber: {
        type: Number,
        required: false,
    },
    custName: {
        type: String,
        required: false,
    },
    custPhone: {
        type: String,
    },
    custAddress: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
    toObject: {
        virtuals: true,
        versionKey: false,
    },
});
orderSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew) {
            let isUnique = false;
            let orderCode;
            // Keep generating until we find a unique code
            while (!isUnique) {
                const random = Math.floor(1000000 + Math.random() * 9000000);
                orderCode = `ORD-${random}`;
                // Check if this code already exists
                const existingOrder = yield this.constructor.findOne({
                    orderCode,
                });
                if (!existingOrder) {
                    isUnique = true;
                }
            }
            if (this.type === order_types_1.OrderTypesEnum.DINEIN && !(this === null || this === void 0 ? void 0 : this.tableNumber)) {
                return next(new apiErrors_1.default("يجب تحديد الطاولة", 400));
            }
            this.orderCode = orderCode;
        }
        next();
    });
});
orderSchema.virtual("orderItemsData", {
    ref: "Meal",
    localField: "orderItems.mealId",
    foreignField: "_id",
    justOne: false,
    autopopulate: true,
});
orderSchema.virtual("cashierData", {
    ref: "User",
    localField: "cashierId",
    foreignField: "_id",
    justOne: true,
    options: {
        select: "username name",
    },
    autopopulate: true,
});
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
