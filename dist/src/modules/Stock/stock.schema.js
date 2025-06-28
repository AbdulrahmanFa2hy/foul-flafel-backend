"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stockSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    supplierName: {
        type: String,
        required: true
    },
    invoice: [
        {
            type: {
                type: String,
                required: true,
                enum: ["Cash", "Postponed"]
            },
            value: {
                type: Number,
                required: true
            },
            residualValue: {
                type: Number,
                required: true,
                default: 0
            },
        },
    ],
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true,
        enum: ['pcs', 'ml', 'grams', 'kg', 'liters', 'cans', 'cups', 'tsp', 'tbsp', 'packets', 'boxes'], // tsp = teaspoon للتوابل 
        default: 'pcs'
    },
    managerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    minimumQuantity: {
        type: Number,
        required: true,
        default: 0
    }
    // status :
    // {
    //     type : String,
    //     require : true,
    //     default : 'active'
    // }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Stock', stockSchema);
