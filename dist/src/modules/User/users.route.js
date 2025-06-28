"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_service_1 = __importDefault(require("./users.service"));
const user_validation_1 = __importDefault(require("./user.validation"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const users_interface_1 = require("./users.interface");
const userRouter = (0, express_1.Router)();
// userRouter.use(authService.protectedRoutes, authService.checkActive, authService.allowedTo('admin'))
userRouter.get('/', users_service_1.default.getAllUsers);
userRouter.post('/', users_service_1.default.uploadImage, users_service_1.default.saveImage, user_validation_1.default.createOne, users_service_1.default.createUser);
userRouter.get('/:id', user_validation_1.default.getOne, users_service_1.default.getUserById);
userRouter.put('/:id', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), users_service_1.default.uploadImage, users_service_1.default.updateImage, user_validation_1.default.updateOne, users_service_1.default.updateUser);
//  userRouter.put('/:id/changePassword',usersValidation.changePassword,usersService.changePassword);
userRouter.delete('/:id', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), user_validation_1.default.deleteOne, users_service_1.default.deleteUser);
userRouter.delete('/:id/image', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), user_validation_1.default.deleteOne, users_service_1.default.deleteUserImage);
exports.default = userRouter;
