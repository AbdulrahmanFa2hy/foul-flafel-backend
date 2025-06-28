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
exports.tableCtrl = void 0;
const table_validation_1 = require("./table.validation");
const table_service_1 = require("./table.service");
const addTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { number, location } = table_validation_1.addTableSchema.parse(req.body);
    const newTable = yield table_service_1.tableService.createTable({ number, location });
    res.status(201).json({
        success: true,
        message: "Table created successfully",
        data: newTable
    });
});
const updateTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tableNumber } = table_validation_1.getTableByNumberSchema.parse(req.params);
    const { number, location } = table_validation_1.updateTableSchema.parse(req.body);
    const updatedTable = yield table_service_1.tableService.updateTable({ tableNumber, data: { number, location } });
    res.status(200).json({
        success: true,
        message: "Table updated successfully",
        data: updatedTable
    });
});
const deleteTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tableNumber } = table_validation_1.getTableByNumberSchema.parse(req.params);
    const deletedTable = yield table_service_1.tableService.deleteTable(tableNumber);
    res.status(200).json({
        success: true,
        message: "Table deleted successfully",
        data: deletedTable
    });
});
const getAllTables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Query before validation:', req.query); // Should show { isAvailable: 'false' }
    const { isAvailable, location } = table_validation_1.getAllTablesSchema.parse(req.query);
    console.log('After validation:', { isAvailable, location }); // Should show { isAvailable: false }
    const tables = yield table_service_1.tableService.getAllTables({ isAvailable, location });
    res.status(200).json({
        success: true,
        message: "Tables fetched successfully",
        data: tables
    });
});
exports.tableCtrl = {
    addTable,
    updateTable,
    deleteTable,
    getAllTables
};
