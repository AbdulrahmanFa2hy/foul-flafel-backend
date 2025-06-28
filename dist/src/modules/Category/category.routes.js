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
const category_service_1 = __importDefault(require("./category.service"));
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const zod_1 = require("zod");
const users_interface_1 = require("../User/users.interface");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const category_validation_1 = require("./category.validation");
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
const categoryRouter = (0, express_1.Router)();
categoryRouter.get('/', category_service_1.default.getAllCategories);
categoryRouter.get('/:id', category_service_1.default.getCategoryById);
categoryRouter.post('/', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), validate(category_validation_1.addCategorySchema), category_service_1.default.addCategory);
categoryRouter.put('/:id', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), validate(category_validation_1.updateCategorySchema), category_service_1.default.updateCategory);
categoryRouter.delete('/:id', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), category_service_1.default.deleteCategory);
exports.default = categoryRouter;
