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
exports.shiftRepository = void 0;
const shift_schema_1 = require("./shift.schema");
class ShiftRepository {
    constructor(shiftModel) {
        this.shiftModel = shiftModel;
    }
    createOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const shift = yield this.shiftModel.create(data);
            return yield this.findOne({ _id: shift._id });
        });
    }
    updateOne(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.shiftModel.findOneAndUpdate(query, data, { new: true }).populate([
                { path: 'cashierData' }
            ]);
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.shiftModel.findOne(query).populate([
                { path: 'cashierData' }
            ]);
        });
    }
    findMany(query_1, _a) {
        return __awaiter(this, arguments, void 0, function* (query, { limit, skip }) {
            return this.shiftModel.find(query).limit(limit).skip(skip).populate([
                { path: 'cashierData' }
            ]);
        });
    }
    deleteOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.shiftModel.deleteOne(query);
            return result.deletedCount > 0;
        });
    }
}
exports.shiftRepository = new ShiftRepository(shift_schema_1.Shift);
