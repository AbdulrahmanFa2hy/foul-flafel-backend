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
exports.shiftCtrl = void 0;
const shift_validation_1 = require("./shift.validation");
const shift_service_1 = require("./shift.service");
const general_1 = require("../../utils/general");
const users_interface_1 = require("../User/users.interface");
const startShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cashierId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const data = shift_validation_1.startShiftSchema.parse(req.body);
    const startedShift = yield shift_service_1.shiftService.startShift(Object.assign(Object.assign({}, data), { cashierId }));
    res.status(201).json({
        success: true,
        message: 'Shift started successfully',
        data: startedShift
    });
});
const endShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cashierId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const data = shift_validation_1.endShiftSchema.parse(req.body);
    const endedShift = yield shift_service_1.shiftService.endShift(Object.assign(Object.assign({}, data), { cashierId }));
    res.status(200).json({
        success: true,
        message: 'Shift ended successfully',
        data: endedShift
    });
});
const getAllShifts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const cashierId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const userRole = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.role;
    const query = shift_validation_1.getAllShiftsSchema.parse(req.query);
    let queryWithFiltering = Object.assign({}, query);
    // If includeAll is true and user is a manager, allow fetching all shifts
    if (query.includeAll && userRole === users_interface_1.UserRoles.MANAGER) {
        // Managers can fetch all shifts for management purposes
        // Don't override the cashierId filter if it was explicitly provided
        if (!query.cashierId) {
            delete queryWithFiltering.cashierId;
        }
    }
    else {
        // Always filter by current user's ID for regular use
        queryWithFiltering.cashierId = cashierId;
    }
    const allShifts = yield shift_service_1.shiftService.findAllShifts(queryWithFiltering);
    res.status(200).json({
        success: true,
        message: "Shifts fetched successfully",
        data: allShifts,
    });
});
const getShiftById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: shiftId } = general_1.params.parse(req.params);
    const shift = yield shift_service_1.shiftService.isShiftExist(shiftId);
    res.status(200).json({
        success: true,
        message: 'Shift fetched successfully',
        data: shift
    });
});
exports.shiftCtrl = {
    startShift,
    endShift,
    getAllShifts,
    getShiftById
};
