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
exports.resolveStockItems = void 0;
const stock_schema_1 = __importDefault(require("./stock.schema"));
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const resolveStockItems = (ingredients) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(ingredients.map((ing) => __awaiter(void 0, void 0, void 0, function* () {
        const stockItem = yield stock_schema_1.default.findOne({
            name: ing.stockName,
            quantity: { $gt: 0 }
        }).sort({ createdAt: -1 });
        if (!stockItem) {
            throw new apiErrors_1.default(`No available stock found for${ing.stockName}`, 404);
        }
        return {
            stockItemId: stockItem._id.toString(),
            stockName: stockItem.name,
            quantityUsed: ing.quantityUsed,
            unit: ing.unit || stockItem.unit
        };
    })));
});
exports.resolveStockItems = resolveStockItems;
