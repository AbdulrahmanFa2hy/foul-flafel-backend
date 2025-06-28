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
exports.isAuthenticated = void 0;
const users_interface_1 = require("../modules/User/users.interface");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiErrors_1 = __importDefault(require("../utils/apiErrors"));
const jsonwebtoken_1 = require("jsonwebtoken");
const users_schema_1 = __importDefault(require("../modules/User/users.schema"));
const shift_repository_1 = require("../modules/Shift/shift.repository");
// Helper function to convert time string to minutes
const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};
const isAuthenticated = (allowedRoles = [], isShiftRequired = true) => {
    return (0, express_async_handler_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new apiErrors_1.default('Unauthorized - No Prefix Token', 401));
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(new apiErrors_1.default('Unauthorized - No Token', 401));
        }
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        const user = yield users_schema_1.default.findById(decoded.userId);
        if (!user) {
            return next(new apiErrors_1.default('User not found', 404));
        }
        if (!user.active) {
            return next(new apiErrors_1.default('User is not active', 401));
        }
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            return next(new apiErrors_1.default('Unauthorized - Not have access to this', 401));
        }
        let shiftId = decoded.shiftId;
        if (user.role === users_interface_1.UserRoles.CASHIER) {
            if (isShiftRequired) {
                const shift = yield shift_repository_1.shiftRepository.findOne({ cashierId: user._id, isCancelled: false });
                if (!shift) {
                    return next(new apiErrors_1.default("You not have any shift ca not make this", 401));
                }
                shiftId = shift._id;
            }
        }
        // if (user && user?.role === UserRoles.CASHIER) {
        //     // Get current UAE time
        //     const now = new Date();
        //     const uaeTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
        //     const currentDay = uaeTime.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Dubai' }).toLowerCase() as ShiftsDaysEnum;
        //     const currentTime = uaeTime.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Dubai' }); // Get current time in 24h format
        //     const currentMinutes = timeToMinutes(currentTime);
        //     // Check if current day is in cashier's shift days
        //     if (!user.shiftDays?.includes(currentDay)) {
        //         console.log(currentDay, user?.shiftDays)
        //         return next(new ApiError('Access denied: Not your shift day', 401));
        //     }
        //     // Check if current time is within shift hours
        //     if (user.shiftStartTime && user.shiftEndTime) {
        //         const startMinutes = timeToMinutes(user.shiftStartTime);
        //         const endMinutes = timeToMinutes(user.shiftEndTime);
        //         if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
        //             return next(new ApiError('Access denied: Outside shift hours', 401));
        //         }
        //     }
        // }
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            shiftId
        };
        return next();
    }));
};
exports.isAuthenticated = isAuthenticated;
