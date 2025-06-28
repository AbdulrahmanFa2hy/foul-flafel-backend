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
const express_1 = require("express");
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const zod_1 = require("zod");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const users_interface_1 = require("../User/users.interface");
const stock_service_1 = __importDefault(require("./stock.service"));
const stock_validation_1 = require("./stock.validation");
const validate = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schema.parseAsync(req.body);
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return next(new apiErrors_1.default(error.errors.map((err) => err.message).join(', '), 400));
        }
        return next(error);
    }
});
const stockRouter = (0, express_1.Router)();
stockRouter.get('/', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), stock_service_1.default.getAllStocks);
stockRouter.get('/:id', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), stock_service_1.default.getStockById);
stockRouter.post('/', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), validate(stock_validation_1.addStockSchema), stock_service_1.default.addStock);
stockRouter.put('/:id', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), validate(stock_validation_1.updateStockSchema), stock_service_1.default.updateStock);
stockRouter.delete('/:id', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), stock_service_1.default.deleteStock);
exports.default = stockRouter;
