"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mealSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    image: {
        url: { type: String, default: "meal-default.png" },
        publicId: { type: String, default: "" },
    },
    categoryId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category" },
    notes: { type: String },
    ingredients: [
        {
            stockItemId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Stock",
                required: true,
            },
            stockName: {
                type: String,
                required: true,
            },
            quantityUsed: {
                type: Number,
                required: true,
                min: 0.01,
            },
            unit: {
                type: String,
                required: true,
                enum: [
                    "pcs",
                    "ml",
                    "grams",
                    "kg",
                    "liters",
                    "cans",
                    "cups",
                    "tsp",
                    "tbsp",
                    "packets",
                    "boxes",
                ], // tsp = teaspoon للتوابل
                default: "pcs",
            },
        },
    ],
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: "true" },
    // category : {type : String, enum : ['breakfast', 'lunch', 'dinner', 'drinks','snacks'] , required : true},
}, { timestamps: true });
const imagesUrl = (document) => {
    if (document.image &&
        typeof document.image === "object" &&
        "url" in document.image &&
        typeof document.image.url === "string" &&
        document.image.url.startsWith("meal")) {
        document.image.url = `${process.env.BASE_URL ||
            "https://foul-flafel-backend-production.up.railway.app"}/images/meal/${document.image.url}`;
    }
};
mealSchema.post("save", imagesUrl);
exports.default = mongoose_1.default.model("Meal", mealSchema);
