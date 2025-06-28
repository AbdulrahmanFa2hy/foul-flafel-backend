"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftsDaysEnum = exports.UserRoles = void 0;
var UserRoles;
(function (UserRoles) {
    UserRoles["ADMIN"] = "admin";
    UserRoles["CASHIER"] = "cashier";
    UserRoles["MANAGER"] = "manager";
})(UserRoles || (exports.UserRoles = UserRoles = {}));
var ShiftsDaysEnum;
(function (ShiftsDaysEnum) {
    ShiftsDaysEnum["SATURDAY"] = "saturday";
    ShiftsDaysEnum["SUNDAY"] = "sunday";
    ShiftsDaysEnum["MONDAY"] = "monday";
    ShiftsDaysEnum["TUESDAY"] = "tuesday";
    ShiftsDaysEnum["WEDNESDAY"] = "wednesday";
    ShiftsDaysEnum["THURSDAY"] = "thursday";
    ShiftsDaysEnum["FRIDAY"] = "friday";
})(ShiftsDaysEnum || (exports.ShiftsDaysEnum = ShiftsDaysEnum = {}));
