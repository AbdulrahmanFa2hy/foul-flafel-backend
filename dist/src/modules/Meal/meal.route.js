"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meal_service_1 = __importDefault(require("./meal.service"));
const users_interface_1 = require("../User/users.interface");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const meal_validation_1 = __importDefault(require("./meal.validation"));
const mealRouter = (0, express_1.Router)();
mealRouter.get('/', meal_service_1.default.getAllMeals);
mealRouter.get('/:id', meal_validation_1.default.getOne, meal_service_1.default.getMealById);
mealRouter.post('/', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), meal_service_1.default.uploadImage, meal_service_1.default.saveImage, meal_validation_1.default.createOne, meal_service_1.default.createMeals);
mealRouter.put('/:id', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), meal_service_1.default.uploadImage, meal_service_1.default.updateImage, meal_validation_1.default.updateOne, meal_service_1.default.updateMeal);
mealRouter.delete('/:id', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), meal_validation_1.default.deleteOne, meal_service_1.default.deleteMeal);
mealRouter.delete('/:id/image', (0, auth_middleware_1.isAuthenticated)([users_interface_1.UserRoles.MANAGER]), meal_validation_1.default.deleteOne, meal_service_1.default.deleteMealImage);
exports.default = mealRouter;
