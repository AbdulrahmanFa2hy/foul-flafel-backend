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
exports.orderRepository = void 0;
const order_schema_1 = require("./order.schema");
class OrderRepository {
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    createOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderModel.create(data);
            return yield this.findOne({ _id: order._id });
        });
    }
    updateOne(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.orderModel.findByIdAndUpdate(query, data, { new: true }).populate([
                { path: 'orderItemsData' }
            ]);
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.orderModel.findOne(query).populate([
                { path: 'orderItemsData' }
            ]);
        });
    }
    findMany(query_1, _a) {
        return __awaiter(this, arguments, void 0, function* (query, { limit, skip }) {
            return this.orderModel.find(query).limit(limit).skip(skip).populate([
                { path: 'orderItemsData' }
            ]);
        });
    }
    deleteOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.orderModel.deleteOne(query).populate([
                { path: 'orderItemsData' }
            ]);
            return result.deletedCount > 0;
        });
    }
}
exports.orderRepository = new OrderRepository(order_schema_1.Order);
