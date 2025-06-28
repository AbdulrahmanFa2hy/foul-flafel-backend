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
exports.shiftService = void 0;
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const pagination_1 = require("../../utils/pagination");
const shift_repository_1 = require("./shift.repository");
class ShiftService {
    constructor(shiftDataSource = shift_repository_1.shiftRepository) {
        this.shiftDataSource = shiftDataSource;
    }
    startShift(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cashierId, startBalance } = data;
                console.log(data);
                // Check if cashier has an open shift
                const isChashierHaveAnotherShiftOpen = yield this.shiftDataSource.findOne({ cashierId, isCancelled: false });
                if (isChashierHaveAnotherShiftOpen) {
                    throw new apiErrors_1.default("You already have running shift, cannot create another", 400);
                }
                // Initialize shift with all required fields
                const shiftData = {
                    cashierId,
                    startBalance,
                    allOrdersCount: 0,
                    notPaidOrdersCount: 0,
                    paymentWithCashBalance: 0,
                    paymentWithVisaBalance: 0,
                    soldItemsCount: 0,
                    isCancelled: false,
                };
                const createdShift = yield this.shiftDataSource.createOne(shiftData);
                if (!createdShift) {
                    throw new apiErrors_1.default("Failed to create shift", 500);
                }
                return createdShift;
            }
            catch (error) {
                console.log(error);
                if (error instanceof apiErrors_1.default)
                    throw error;
                throw new apiErrors_1.default("Start new shift failed", 500);
            }
        });
    }
    endShift(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cashierId, endBalance } = data;
                const isChashierHaveShiftOpen = (yield this.shiftDataSource.findOne({
                    cashierId,
                    isCancelled: false,
                }));
                if (!isChashierHaveShiftOpen) {
                    throw new apiErrors_1.default("You have not running shift", 400);
                }
                if (isChashierHaveShiftOpen.cashierId.toString() != cashierId) {
                    throw new apiErrors_1.default("You not the owner of shift, cn not end it", 400);
                }
                // const areThereNotPaidOrders = await orderRepository.findMany(
                //   { shiftId: isChashierHaveShiftOpen?._id, isPaid: false },
                //   { limit: 1, skip: 0 }
                // );
                // const areThereNotPaidOrders = await orderRepository.findMany(
                //   { shiftId: isChashierHaveShiftOpen?._id, isPaid: false },
                //   { limit: 1, skip: 0 }
                // );
                if (isChashierHaveShiftOpen.notPaidOrdersCount > 0) {
                    throw new apiErrors_1.default("Must all orders are paid or can not end this shift", 500);
                }
                const endedShift = yield this.shiftDataSource.updateOne({ _id: isChashierHaveShiftOpen._id }, { isCancelled: true, cancelledAt: new Date(), endBalance });
                return endedShift;
            }
            catch (error) {
                console.log(error);
                if (error instanceof apiErrors_1.default)
                    throw error;
                throw new apiErrors_1.default("End exist shift failed", 500);
            }
        });
    }
    findAllShifts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, size, cashierId, }) {
            let query = {};
            // Only filter by cashierId if it's provided
            if (cashierId)
                query.cashierId = cashierId;
            const { skip, limit } = (0, pagination_1.pagenation)({ page, size });
            return yield this.shiftDataSource.findMany(query, { skip, limit });
        });
    }
    isShiftExist(shiftId) {
        return __awaiter(this, void 0, void 0, function* () {
            const shiftIsExists = yield this.shiftDataSource.findOne({ _id: shiftId });
            if (!shiftIsExists) {
                throw new apiErrors_1.default("Shift not found", 404);
            }
            return shiftIsExists;
        });
    }
}
exports.shiftService = new ShiftService();
