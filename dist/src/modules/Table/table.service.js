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
exports.tableService = void 0;
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const table_repository_1 = require("./table.repository");
class TableService {
    constructor(tableDataSource = table_repository_1.tableRepository) {
        this.tableDataSource = tableDataSource;
    }
    isTableExists(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.tableDataSource.findOne({ number });
            return !!table;
        });
    }
    isTableAvalible(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.tableDataSource.findOne({ number, isAvailable: true });
            return !!table;
        });
    }
    createTable(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { number } = data;
                const isTableExists = yield this.isTableExists(number);
                if (isTableExists) {
                    throw new apiErrors_1.default("Table number already exists", 400);
                }
                return this.tableDataSource.createOne(data);
            }
            catch (error) {
                console.log(error);
                if (error instanceof apiErrors_1.default) {
                    throw error;
                }
                throw new apiErrors_1.default("Failed to create table", 500);
            }
        });
    }
    updateTable(_a) {
        return __awaiter(this, arguments, void 0, function* ({ tableNumber, data }) {
            try {
                const updatedTable = yield this.tableDataSource.updateOne({ number: tableNumber }, data);
                return updatedTable;
            }
            catch (error) {
                if (error instanceof apiErrors_1.default) {
                    throw error;
                }
                throw new apiErrors_1.default("Failed to update table", 500);
            }
        });
    }
    deleteTable(tableNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedTable = yield this.tableDataSource.deleteOne({ number: tableNumber });
                return deletedTable;
            }
            catch (error) {
                if (error instanceof apiErrors_1.default) {
                    throw error;
                }
                throw new apiErrors_1.default("Failed to delete table", 500);
            }
        });
    }
    getAllTables(_a) {
        return __awaiter(this, arguments, void 0, function* ({ isAvailable, location }) {
            try {
                let query = {};
                if (location) {
                    query.location = location;
                }
                const table = yield this.tableDataSource.findMany(query);
                return table;
            }
            catch (error) {
                if (error instanceof apiErrors_1.default) {
                    throw error;
                }
                throw new apiErrors_1.default("Failed to get all tables", 500);
            }
        });
    }
}
exports.tableService = new TableService(table_repository_1.tableRepository);
