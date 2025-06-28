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
const stockOutFlow_validation_1 = require("./stockOutFlow.validation");
const stockOutflow_schema_1 = __importDefault(require("./stockOutflow.schema"));
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const zod_1 = require("zod");
const Order_1 = require("../Order");
class StockOutFlowService {
    constructor() {
        // addStockOutFlow : any = expressAsyncHandler(
        // async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        //     try {
        //         const validationData = addStockOutFlowSchema.parse(req.body);
        //         const stockOutFlow : IStockOutflow = await stockOutflowSchema.create(validationData);
        //         if (!stockOutFlow) {
        //             return next(new ApiError(`${req.__('not_found')}`, 404));
        //         }
        //         res.status(201).json({ message: "Stock outflow added successfully", data: stockOutFlow });
        //     }
        //     catch (error) {
        //         if (error instanceof z.ZodError) {
        //             return next(new ApiError(error.errors.map((err) => err.message).join(', '), 400));
        //         }
        //         return next(error);
        //     }
        // })
        this.getStockOutFlowByOrder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            const stockOutFlow = yield Order_1.Order.findOne({ orderId });
            if (!stockOutFlow) {
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            }
            res.status(200).json({ message: "Stock outflow fetched successfully", data: stockOutFlow });
        }));
        this.updateStockOutFlow = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validationData = stockOutFlow_validation_1.updateStockOutFlowSchema.parse(req.body);
                const stockOutFlow = yield stockOutflow_schema_1.default.findByIdAndUpdate(req.params.id, validationData, { new: true });
                if (!stockOutFlow) {
                    return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
                }
                res.status(200).json({ message: "Stock outflow updated successfully", data: stockOutFlow });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return next(new apiErrors_1.default(error.errors.map((err) => err.message).join(', '), 400));
                }
                return next(error);
            }
        }));
        this.deleteStockOutFlow = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const stockOutFlow = yield stockOutflow_schema_1.default.findByIdAndDelete(req.params.id);
            if (!stockOutFlow) {
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            }
            res.status(200).json({ message: "Stock outflow deleted successfully", data: stockOutFlow });
        }));
    }
}
const stockOutflowService = new StockOutFlowService();
exports.default = stockOutflowService;
