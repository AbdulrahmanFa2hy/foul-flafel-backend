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
exports.tableRepository = void 0;
const table_schema_1 = require("./table.schema");
class TableRepository {
    constructor(tableModel) {
        this.tableModel = tableModel;
    }
    createOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tableModel.create(data);
        });
    }
    updateOne(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tableModel.findOneAndUpdate(query, data, { new: true });
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tableModel.findOne(query);
        });
    }
    findMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tableModel.find(query);
        });
    }
    deleteOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.tableModel.deleteOne(query);
            return result.deletedCount > 0;
        });
    }
}
exports.tableRepository = new TableRepository(table_schema_1.Table);
