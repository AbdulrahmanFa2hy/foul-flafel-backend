"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealIngredient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mealIngredientSchema = new mongoose_1.default.Schema({
    mealId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Meal',
        required: true
    },
    stockItemId: { type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    quantityUsed: {
        type: Number,
        required: true
    },
    unit: { type: String,
        default: 'pcs' }
}, { timestamps: true });
exports.MealIngredient = mongoose_1.default.model('MealIngredient', mealIngredientSchema);
