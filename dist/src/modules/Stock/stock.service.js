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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const zod_1 = require("zod");
const stock_schema_1 = __importDefault(require("./stock.schema"));
const stock_validation_1 = require("./stock.validation");
class StockService {
    constructor() {
        this.addStock = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = stock_validation_1.addStockSchema.parse(req.body);
                const stock = yield stock_schema_1.default.create(validatedData);
                if (!stock) {
                    return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
                }
                res.status(201).json({ message: "Stock created successfully", data: stock });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return next(new apiErrors_1.default(error.errors.map((err) => err.message).join(', '), 400));
                }
                return next(error);
            }
        }));
        this.getStockById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const stock = yield stock_schema_1.default.findById(req.params.id);
            if (!stock) {
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            }
            res.status(200).json({ message: "Stock fetched successfully", data: stock });
        }));
        this.getAllStocks = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const stocks = yield stock_schema_1.default.find();
            if (!stocks) {
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            }
            res.status(200).json({ message: "Stocks fetched successfully", data: stocks });
        }));
        this.updateStock = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = stock_validation_1.updateStockSchema.parse(req.body);
                const stock = yield stock_schema_1.default.findByIdAndUpdate(req.params.id, validatedData, { new: true });
                if (!stock) {
                    return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
                }
                res.status(200).json({ message: "Stock updated successfully", data: stock });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return next(new apiErrors_1.default(error.errors.map((err) => err.message).join(', '), 400));
                }
                return next(error);
            }
        }));
        this.deleteStock = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const stock = yield stock_schema_1.default.findByIdAndDelete(req.params.id);
            if (!stock) {
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            }
            res.status(200).json({ message: "Stock deleted successfully", data: stock });
        }));
    }
}
const stockService = new StockService();
exports.default = stockService;
