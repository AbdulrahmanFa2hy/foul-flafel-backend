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
exports.orderService = void 0;
const meal_schema_1 = __importDefault(require("../Meal/meal.schema"));
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const pagination_1 = require("../../utils/pagination");
const order_repository_1 = require("./order.repository");
const order_schema_1 = require("./order.schema");
const stockOutflow_schema_1 = __importDefault(require("../StockOutflow/stockOutflow.schema"));
const stock_schema_1 = __importDefault(require("../Stock/stock.schema"));
const shift_repository_1 = require("../Shift/shift.repository");
const Table_1 = require("../Table");
const order_types_1 = require("./order.types");
class OrderService {
    constructor(orderdDataSource = order_repository_1.orderRepository) {
        this.orderdDataSource = orderdDataSource;
    }
    isOrderExist(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderdDataSource.findOne({ _id: orderId });
            if (!order) {
                throw new apiErrors_1.default('الطلب غير موجود', 404);
            }
            return order;
        });
    }
    findOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.orderdDataSource.findOne({ _id: orderId });
        });
    }
    updateOrder(_a) {
        return __awaiter(this, arguments, void 0, function* ({ orderId, data }) {
            const updatedOrder = yield this.orderdDataSource.updateOne({ _id: orderId }, data);
            if (!updatedOrder) {
                throw new apiErrors_1.default('Failed to update order', 500);
            }
            return updatedOrder;
        });
    }
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderItems, cashierId, type, custName, custPhone, custAddress, shiftId, tableNumber } = data;
                let orderObject = {};
                // check table 
                if (type === order_types_1.OrderTypesEnum.DINEIN) { ///
                    if (!tableNumber) {
                        throw new apiErrors_1.default('يجب عليك تحديد الطاولة', 400);
                    }
                    //! Check if table is exist
                    const table = yield Table_1.tableService.isTableAvalible(tableNumber);
                    if (!table) {
                        throw new apiErrors_1.default('Table not found or not available', 404);
                    }
                    orderObject.tableNumber = tableNumber;
                }
                //! Check is all meal availbale
                let totalPrice = 0;
                const newOrderItems = [];
                let allItemsCount = 0;
                for (const item of orderItems) {
                    const meal = yield meal_schema_1.default.findById(item.mealId);
                    allItemsCount += item.quantity;
                    if (!meal || !(meal === null || meal === void 0 ? void 0 : meal.isAvailable)) {
                        throw new apiErrors_1.default('Meal not available now', 404);
                    }
                    // console.log(meal)
                    // console.log(meal.departmentId)
                    const mealObj = meal.toObject();
                    console.log(mealObj);
                    totalPrice += meal.price * item.quantity;
                    newOrderItems.push({
                        mealId: item.mealId,
                        quantity: item.quantity,
                        price: mealObj.price,
                        isCancelled: false,
                        note: (item === null || item === void 0 ? void 0 : item.note) || ""
                    });
                }
                orderObject.orderItems = newOrderItems;
                orderObject.totalPrice = totalPrice;
                orderObject.type = type;
                if (custName)
                    orderObject.custName = custName;
                if (custPhone)
                    orderObject.custPhone = custPhone;
                if (custAddress)
                    orderObject.custAddress = custAddress;
                if (shiftId)
                    orderObject.shiftId = shiftId;
                if (cashierId)
                    orderObject.cashierId = cashierId;
                const order = yield this.orderdDataSource.createOne(orderObject);
                //////// إذا كان الطلب مدفوعًا، قم بتحديث حالة الدفع
                if (order && orderObject.isPaid) {
                    yield this.markOrderAsPaid(order._id.toString());
                }
                if (tableNumber) {
                    yield Table_1.tableService.updateTable({ tableNumber, data: { isAvailable: false } });
                }
                // update shift data
                yield shift_repository_1.shiftRepository.updateOne({ _id: shiftId }, { $inc: { allOrdersCount: 1, notPaidOrdersCount: 1, soldItemsCount: allItemsCount } });
                return order;
            }
            catch (error) {
                console.log(error);
                if (error instanceof apiErrors_1.default) {
                    throw error;
                }
                throw new apiErrors_1.default('Failed to create order', 500);
            }
        });
    }
    addMealToOrder(_a) {
        return __awaiter(this, arguments, void 0, function* ({ orderId, orderItem }) {
            try {
                let { orderItems, totalPrice } = yield this.isOrderExist(orderId);
                const meal = yield meal_schema_1.default.findById(orderItem.mealId);
                if (!meal || !(meal === null || meal === void 0 ? void 0 : meal.isAvailable)) {
                    throw new apiErrors_1.default('Meal not available now', 404);
                }
                const mealObj = meal.toObject();
                console.log(mealObj);
                //! Update order items if meal is already in order
                orderItems = orderItems.filter(item => item.mealId.toString() !== orderItem.mealId.toString());
                orderItems.push({
                    mealId: orderItem.mealId,
                    quantity: orderItem.quantity,
                    price: meal.price,
                    isCancelled: false,
                    note: (orderItem === null || orderItem === void 0 ? void 0 : orderItem.note) || ""
                });
                totalPrice = orderItems.reduce((acc, item) => acc + (item.isCancelled ? 0 : item.price * item.quantity), 0);
                const updatedOrder = yield this.orderdDataSource.updateOne({ _id: orderId }, { totalPrice, orderItems });
                // update shift data
                yield shift_repository_1.shiftRepository.updateOne({ _id: updatedOrder === null || updatedOrder === void 0 ? void 0 : updatedOrder.shiftId }, { $inc: { soldItemsCount: orderItem.quantity } });
                return updatedOrder;
            }
            catch (error) {
                console.log(error);
                if (error instanceof apiErrors_1.default)
                    throw error;
                throw new apiErrors_1.default('Failed to add meal to order', 500);
            }
        });
    }
    deleteMealFromOrder(_a) {
        return __awaiter(this, arguments, void 0, function* ({ orderId, mealId: mealIdData }) {
            try {
                const order = yield this.isOrderExist(orderId);
                // Update the orderItems array directly
                const orderItems = order.orderItems.map(item => {
                    // console.log(item.mealId.toString(), mealIdData)
                    const { isCancelled, mealId, price, quantity, note } = item;
                    return item.mealId.toString() === mealIdData.toString()
                        ? {
                            mealId, price, quantity, note,
                            isCancelled: true
                        }
                        : {
                            isCancelled, mealId, price, quantity, note
                        };
                });
                // console.log(orderItems);
                const totalPrice = orderItems.reduce((acc, item) => acc + (item.isCancelled ? 0 : item.price * item.quantity), 0);
                const updatedOrder = yield this.orderdDataSource.updateOne({ _id: orderId }, { $set: { orderItems, totalPrice } });
                if (!updatedOrder) {
                    throw new apiErrors_1.default('Failed to update order', 500);
                }
                return updatedOrder;
            }
            catch (error) {
                if (error instanceof apiErrors_1.default)
                    throw error;
                throw new apiErrors_1.default('Failed to delete meal from order', 500);
            }
        });
    }
    deleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.isOrderExist(orderId);
                const result = yield this.orderdDataSource.deleteOne({ _id: orderId });
                if (!result)
                    throw new apiErrors_1.default('Failed to delete order', 500);
                return result;
            }
            catch (error) {
                if (error instanceof apiErrors_1.default)
                    throw error;
                throw new apiErrors_1.default('Failed to delete order', 500);
            }
        });
    }
    getAllOrders(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, size, date, cashierId, shiftId }) {
            try {
                const query = {};
                if (date) {
                    query.createdAt = { $gte: date };
                }
                if (cashierId) {
                    query.cashierId = cashierId;
                }
                if (shiftId) {
                    query.shiftId = shiftId;
                }
                console.log(query);
                const { limit, skip } = (0, pagination_1.pagenation)({ page, size });
                return this.orderdDataSource.findMany(query, { limit, skip });
            }
            catch (error) {
                if (error instanceof apiErrors_1.default)
                    throw error;
                throw new apiErrors_1.default('failed to get orders', 500);
            }
        });
    }
    changeTable(_a) {
        return __awaiter(this, arguments, void 0, function* ({ orderId, tableNumber }) {
            try {
                const order = yield this.isOrderExist(orderId);
                if (order.type === order_types_1.OrderTypesEnum.TAKEAWAY && !(order === null || order === void 0 ? void 0 : order.tableNumber)) {
                    throw new apiErrors_1.default('هذا الطلب ليس لديه طاولات', 400);
                }
                const table = yield Table_1.tableService.isTableAvalible(tableNumber);
                if (!table) {
                    throw new apiErrors_1.default('Table not found or not available', 404);
                }
                if (order.tableNumber === tableNumber) {
                    throw new apiErrors_1.default('Table is already assigned to this order', 400);
                }
                const updatedOrder = yield this.orderdDataSource.updateOne({ _id: orderId }, { tableNumber });
                if (order === null || order === void 0 ? void 0 : order.tableNumber) {
                    yield Table_1.tableService.updateTable({ tableNumber: order === null || order === void 0 ? void 0 : order.tableNumber, data: { isAvailable: true } });
                    yield Table_1.tableService.updateTable({ tableNumber, data: { isAvailable: false } });
                }
                return updatedOrder;
            }
            catch (error) {
                if (error instanceof apiErrors_1.default)
                    throw error;
                throw new apiErrors_1.default('Failed to change table', 500);
            }
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderdDataSource.findOne(query);
            if (!order) {
                throw new apiErrors_1.default('الطلب غير موجود', 404);
            }
            return order;
        });
    }
    getOrderByCode(orderCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ orderCode });
        });
    }
    getOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ _id: orderId });
        });
    }
    getOrderByTable(tableNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ tableNumber, isPaid: false });
        });
    }
    cancelOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.isOrderExist(orderId);
                if (order.isCancelled) {
                    throw new apiErrors_1.default('Order is already cancelled', 400);
                }
                if (order.isPaid) {
                    throw new apiErrors_1.default('Order is already paid cannot cancelled it', 400);
                }
                const cancelledOrder = yield this.orderdDataSource.updateOne({ _id: orderId }, { isCancelled: true });
                if (order.tableNumber) {
                    yield Table_1.tableService.updateTable({
                        tableNumber: order.tableNumber,
                        data: { isAvailable: true }
                    });
                }
                // update shift data
                yield shift_repository_1.shiftRepository.updateOne({ _id: order.shiftId }, { $inc: { notPaidOrdersCount: -1, cancelledOrdersCount: 1 } });
                return cancelledOrder;
            }
            catch (error) {
                if (error instanceof apiErrors_1.default)
                    throw error;
                throw new apiErrors_1.default('Failed to cancel order', 500);
            }
        });
    }
    markOrderAsPaid(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. الحصول على الطلب مع الوجبات
            const order = yield order_schema_1.Order.findById(orderId)
                .populate({
                path: 'orderItems.mealId',
                populate: { path: 'ingredients.stockItemId' }
            });
            // 1. التحقق من وجود الطلب
            if (!order) {
                throw new apiErrors_1.default('Order not found', 404);
            }
            // 1. التحقق من وجود الطاولة
            if (order.tableNumber) {
                yield Table_1.tableService.updateTable({
                    tableNumber: order.tableNumber,
                    data: { isAvailable: true }
                });
            }
            // 2. التحقق من توفر المخزون
            yield this.verifyStockAvailability(order);
            // 3. خصم المخزون وتسجيل التدفقات
            yield this.deductStockAndRecordOutflows(order);
            // // 4. تحديث حالة الطلب
            // order.status = OrderStatus.COMPLETED;
            return yield order.save();
            ;
        });
    }
    verifyStockAvailability(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const insufficientItems = [];
            for (const item of order.orderItems) {
                const meal = item.mealId;
                for (const ingredient of meal.ingredients) {
                    const stock = yield stock_schema_1.default.findById(ingredient.stockItemId);
                    const requiredQuantity = ingredient.quantityUsed * item.quantity;
                    if (!stock || stock.quantity < requiredQuantity) {
                        insufficientItems.push(`${meal.name} - ${(stock === null || stock === void 0 ? void 0 : stock.name) || 'Unknown'} (Needed: ${requiredQuantity}, Available: ${(stock === null || stock === void 0 ? void 0 : stock.quantity) || 0})`);
                    }
                }
            }
            if (insufficientItems.length > 0) {
                throw new apiErrors_1.default(`Insufficient stock for: ${insufficientItems.join(', ')}`, 400);
            }
        });
    }
    deductStockAndRecordOutflows(order) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const item of order.orderItems) {
                const meal = item.mealId;
                for (const ingredient of meal.ingredients) {
                    const quantityUsed = ingredient.quantityUsed * item.quantity;
                    // خصم من المخزون
                    yield stock_schema_1.default.findByIdAndUpdate(ingredient.stockItemId, { $inc: { quantity: -quantityUsed } });
                    // تسجيل تدفق المخزون
                    yield stockOutflow_schema_1.default.create({
                        stockItemId: ingredient.stockItemId,
                        orderId: order._id,
                        quantityUsed,
                        date: new Date()
                    });
                }
            }
        });
    }
}
exports.orderService = new OrderService();
