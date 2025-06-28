"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_validation_1 = __importDefault(require("./auth.validation"));
const auth_service_1 = __importDefault(require("./auth.service"));
const users_service_1 = __importDefault(require("../User/users.service"));
const authRouter = (0, express_1.Router)();
authRouter.post('/signup', users_service_1.default.uploadImage, users_service_1.default.saveImage, auth_validation_1.default.signup, auth_service_1.default.signup);
authRouter.post('/login', auth_validation_1.default.login, auth_service_1.default.login);
exports.default = authRouter;
