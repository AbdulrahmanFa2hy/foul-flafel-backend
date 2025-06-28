"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sanitization {
    User(user) {
        return {
            _id: user === null || user === void 0 ? void 0 : user._id,
            name: user === null || user === void 0 ? void 0 : user.name,
            username: user === null || user === void 0 ? void 0 : user.username,
            email: user === null || user === void 0 ? void 0 : user.email,
            image: user === null || user === void 0 ? void 0 : user.image,
            role: user === null || user === void 0 ? void 0 : user.role,
            active: user === null || user === void 0 ? void 0 : user.active,
            hasPassword: user === null || user === void 0 ? void 0 : user.hasPassword,
            googleId: user === null || user === void 0 ? void 0 : user.googleId,
            shiftDays: user === null || user === void 0 ? void 0 : user.shiftDays,
            shiftStartDay: user === null || user === void 0 ? void 0 : user.shiftStartDay,
            shiftEndDay: user === null || user === void 0 ? void 0 : user.shiftEndDay
        };
    }
}
const sanitization = new Sanitization();
exports.default = sanitization;
