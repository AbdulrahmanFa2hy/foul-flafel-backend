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
const express_validator_1 = require("express-validator");
const validator_middleware_1 = __importDefault(require("../../middleware/validator.middleware"));
const meal_schema_1 = __importDefault(require("./meal.schema"));
class MealsValidation {
    constructor() {
        this.createOne = [
            (0, express_validator_1.body)("name")
                .notEmpty()
                .withMessage("name is required")
                .isLength({ min: 3, max: 50 })
                .withMessage("name must be at least 3 characters long"),
            (0, express_validator_1.body)("price").notEmpty().withMessage("price is required"),
            (0, express_validator_1.body)("categoryId")
                .isMongoId()
                .withMessage((val, { req }) => req.__("invalid_id"))
                .optional(),
            (0, express_validator_1.body)("isAvailable")
                .isBoolean()
                .withMessage("isAvailable must be a boolean")
                .optional(),
            (0, express_validator_1.body)("notes").isString().withMessage("notes must be a string").optional(),
            (0, express_validator_1.body)("ingredients").isArray().withMessage("ingredients must be an array"),
            (0, express_validator_1.body)("ingredients.*.stockItemId")
                .isMongoId()
                .withMessage((val, { req }) => req.__("invalid_id")),
            (0, express_validator_1.body)("ingredients.*.quantityUsed")
                .isNumeric()
                .withMessage("quantityUsed must be a number"),
            (0, express_validator_1.body)("ingredients.*.unit").isString().withMessage("unit must be a string"),
            (0, express_validator_1.body)("ingredients.*.stockName")
                .isString()
                .withMessage("stockName must be a string"),
            validator_middleware_1.default,
        ];
        this.updateOne = [
            (0, express_validator_1.param)("id")
                .isMongoId()
                .withMessage((val, { req }) => req.__("invalid_id")),
            (0, express_validator_1.body)("name")
                .optional()
                .isLength({ min: 2, max: 50 })
                .withMessage("name must be at least 2 characters long")
                .custom((val_1, _a) => __awaiter(this, [val_1, _a], void 0, function* (val, { req }) {
                var _b;
                const meal = yield meal_schema_1.default.findOne({ name: val });
                if (meal && meal._id.toString() !== ((_b = req.params) === null || _b === void 0 ? void 0 : _b.id.toString()))
                    throw new Error("Meal already exists");
                return true;
            })),
            (0, express_validator_1.body)("price").optional(),
            (0, express_validator_1.body)("categoryId")
                .optional()
                .isMongoId()
                .withMessage((val, { req }) => req.__("invalid_id")),
            (0, express_validator_1.body)("isAvailable")
                .optional()
                .isBoolean()
                .withMessage("isAvailable must be a boolean"),
            (0, express_validator_1.body)("notes").optional().isString().withMessage("notes must be a string"),
            (0, express_validator_1.body)("ingredients")
                .optional()
                .isArray()
                .withMessage("ingredients must be an array"),
            (0, express_validator_1.body)("ingredients.*.stockItemId")
                .optional()
                .isMongoId()
                .withMessage((val, { req }) => req.__("invalid_id")),
            (0, express_validator_1.body)("ingredients.*.quantityUsed")
                .optional()
                .isNumeric()
                .withMessage("quantityUsed must be a number"),
            (0, express_validator_1.body)("ingredients.*.unit")
                .optional()
                .isString()
                .withMessage("unit must be a string"),
            (0, express_validator_1.body)("ingredients.*.stockName")
                .optional()
                .isString()
                .withMessage("stockName must be a string"),
            validator_middleware_1.default,
        ];
        this.getOne = [
            (0, express_validator_1.param)("id")
                .isMongoId()
                .withMessage((val, { req }) => req.__("invalid_id")),
            validator_middleware_1.default,
        ];
        this.deleteOne = [
            (0, express_validator_1.param)("id")
                .isMongoId()
                .withMessage((val, { req }) => req.__("invalid_id")),
            validator_middleware_1.default,
        ];
    }
}
const mealsValidation = new MealsValidation();
exports.default = mealsValidation;
