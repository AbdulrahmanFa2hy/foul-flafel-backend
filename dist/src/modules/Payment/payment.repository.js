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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRepository = void 0;
const payment_schema_1 = require("./payment.schema");
class OrderRepository {
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    createOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.orderModel.create(data);
            return yield this.findOne({ _id: payment._id });
        });
    }
    updateOne(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.orderModel
                .findByIdAndUpdate(query, data, { new: true })
                .populate([{ path: "orderData" }, { path: "cashierData" }]);
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.orderModel
                .findById(query)
                .populate([{ path: "orderData" }, { path: "cashierData" }]);
        });
    }
    findMany(query_1, _a, orderQuery_1) {
        return __awaiter(this, arguments, void 0, function* (query, { limit, skip }, orderQuery) {
            let aggregationPipeline = [
                { $match: query },
                {
                    $lookup: {
                        from: "orders",
                        localField: "orderId",
                        foreignField: "_id",
                        as: "orderData",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "cashierId",
                        foreignField: "_id",
                        as: "cashierData",
                    },
                },
                {
                    $addFields: {
                        orderData: { $arrayElemAt: ["$orderData", 0] },
                        cashierData: { $arrayElemAt: ["$cashierData", 0] },
                    },
                },
            ];
            // Add order search if provided
            if (orderQuery && Object.keys(orderQuery).length > 0) {
                aggregationPipeline.push({
                    $match: {
                        "orderData.orderCode": orderQuery.orderCode,
                    },
                });
            }
            // Sort by creation date (latest first)
            aggregationPipeline.push({ $sort: { createdAt: -1 } });
            // Add pagination
            aggregationPipeline.push({ $skip: skip }, { $limit: limit });
            return this.orderModel.aggregate(aggregationPipeline);
        });
    }
    countDocuments(query, orderQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let aggregationPipeline = [
                { $match: query },
                {
                    $lookup: {
                        from: "orders",
                        localField: "orderId",
                        foreignField: "_id",
                        as: "orderData",
                    },
                },
                // Flatten the orderData array
                {
                    $addFields: {
                        orderData: { $arrayElemAt: ["$orderData", 0] },
                    },
                },
            ];
            // Add order search if provided
            if (orderQuery && Object.keys(orderQuery).length > 0) {
                aggregationPipeline.push({
                    $match: {
                        "orderData.orderCode": orderQuery.orderCode,
                    },
                });
            }
            // Count documents
            aggregationPipeline.push({ $count: "total" });
            const result = yield this.orderModel.aggregate(aggregationPipeline);
            return result.length > 0 ? result[0].total : 0;
        });
    }
    deleteOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.orderModel.deleteOne(query);
            return result.deletedCount > 0;
        });
    }
}
exports.paymentRepository = new OrderRepository(payment_schema_1.Payment);
