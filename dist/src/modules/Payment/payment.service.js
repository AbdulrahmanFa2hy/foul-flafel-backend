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
exports.paymentService = void 0;
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const pagination_1 = require("../../utils/pagination");
const Order_1 = require("../Order");
const shift_repository_1 = require("../Shift/shift.repository");
const payment_repository_1 = require("./payment.repository");
const payment_types_1 = require("./payment.types");
class PaymentService {
    constructor(paymentDataSource = payment_repository_1.paymentRepository) {
        this.paymentDataSource = paymentDataSource;
    }
    createPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, discount, paymentMethods, tax, shiftId } = data;
                // check if order exists and avalible
                const order = yield Order_1.orderService.isOrderExist(orderId);
                if (!order) {
                    throw new apiErrors_1.default("Order not found", 404);
                }
                if (order.isCancelled) {
                    throw new apiErrors_1.default("Order is cancelled", 400);
                }
                if (order.isPaid) {
                    throw new apiErrors_1.default("Order is already paid", 400);
                }
                // check if discount is valid
                const orderTotalAmount = order.totalPrice;
                let expectedValue = orderTotalAmount;
                const totalAmount = paymentMethods.reduce((acc, curr) => acc + curr.amount, 0);
                if (tax) {
                    expectedValue += (orderTotalAmount * tax) / 100;
                }
                if (discount) {
                    expectedValue -= (orderTotalAmount * discount) / 100;
                }
                // check if total amount is correct
                if (expectedValue != totalAmount) {
                    throw new apiErrors_1.default("The amount paid is not enough for the order value", 400);
                }
                const payment = yield this.paymentDataSource.createOne(Object.assign(Object.assign({}, data), { totalAmount }));
                // update order data => isPaid
                yield Order_1.orderService.updateOrder({ orderId, data: { isPaid: true } });
                // update shift data => notPaidOrders -1, balance cash/visa
                let paymentWithCash = 0;
                let paymentWithVisa = 0;
                for (const { amount, method } of paymentMethods) {
                    if (method === payment_types_1.PaymentMethod.VISA) {
                        paymentWithVisa += amount;
                    }
                    if (method === payment_types_1.PaymentMethod.CASH) {
                        paymentWithCash += amount;
                    }
                }
                yield shift_repository_1.shiftRepository.updateOne({ _id: shiftId }, {
                    $inc: {
                        notPaidOrdersCount: -1,
                        paymentWithCashBalance: paymentWithCash,
                        paymentWithVisaBalance: paymentWithVisa,
                    },
                });
                yield Order_1.orderService.markOrderAsPaid(orderId);
                // Print reset for payment
                return payment;
            }
            catch (error) {
                if (error instanceof apiErrors_1.default) {
                    throw error;
                }
                throw new apiErrors_1.default("Failed to create payment", 500);
            }
        });
    }
    getAllPayments(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, size, paymentMethod, date, shiftId, cashierId, search, }) {
            try {
                let query = {};
                if (paymentMethod) {
                    query.paymentMethods = { $elemMatch: { method: paymentMethod } };
                }
                if (shiftId) {
                    query.shiftId = shiftId;
                }
                if (cashierId) {
                    query.cashierId = cashierId;
                }
                if (date) {
                    query.createdAt = { $gte: date };
                }
                // Handle search by order code
                let orderQuery = {};
                if (search) {
                    orderQuery.orderCode = { $regex: search, $options: "i" };
                }
                const { skip, limit } = (0, pagination_1.pagenation)({ page, size });
                // Get total count for pagination
                const totalCount = yield this.paymentDataSource.countDocuments(query, orderQuery);
                // Get payments with pagination
                const payments = yield this.paymentDataSource.findMany(query, { skip, limit }, orderQuery);
                const totalPages = Math.ceil(totalCount / limit);
                return {
                    data: payments,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalItems: totalCount,
                        pageSize: limit,
                        hasNextPage: page < totalPages,
                        hasPrevPage: page > 1,
                    },
                };
            }
            catch (error) {
                console.log(error);
                if (error instanceof apiErrors_1.default)
                    throw error;
                throw new apiErrors_1.default("Failed to get all payments", 500);
            }
        });
    }
    getPaymentById(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield this.paymentDataSource.findOne({ _id: paymentId });
                return payment;
            }
            catch (error) {
                throw new apiErrors_1.default("Failed to get payment by id", 500);
            }
        });
    }
}
exports.paymentService = new PaymentService();
