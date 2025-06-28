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
const users_schema_1 = __importDefault(require("./users.schema"));
class UsersValidation {
    constructor() {
        this.createOne = [
            (0, express_validator_1.body)('username').notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 2, max: 50 }).withMessage((val, { req }) => req.__('validation_length_short'))
                .custom((val_1, _a) => __awaiter(this, [val_1, _a], void 0, function* (val, { req }) {
                const user = yield users_schema_1.default.findOne({ username: val });
                if (user)
                    throw new Error(`${req.__('validation_username_check')}`);
                return true;
            })),
            (0, express_validator_1.body)('role')
                .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isIn(['admin', 'manager', 'cashier']).withMessage((val, { req }) => req.__('validation_role')),
            (0, express_validator_1.body)('name').notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 2, max: 50 }).withMessage((val, { req }) => req.__('validation_length_short')),
            (0, express_validator_1.body)('password').notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 6, max: 20 }).withMessage((val, { req }) => req.__('validation_length_password')),
            validator_middleware_1.default
        ];
        this.updateOne = [
            (0, express_validator_1.param)('id').isMongoId().withMessage((val, { req }) => req.__('invalid_id')),
            (0, express_validator_1.body)('name').optional()
                .isLength({ min: 2, max: 50 }).withMessage((val, { req }) => req.__('validation_length_short')),
            validator_middleware_1.default
        ];
        this.changePassword = [
            (0, express_validator_1.param)('id').isMongoId().withMessage((val, { req }) => req.__('invalid_id')),
            (0, express_validator_1.body)('password')
                .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 6, max: 20 }).withMessage((val, { req }) => req.__('validation_length_password')),
            (0, express_validator_1.body)('confirmPassword')
                .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 6, max: 20 }).withMessage((val, { req }) => req.__('validation_length_password'))
                .custom((val_1, _a) => __awaiter(this, [val_1, _a], void 0, function* (val, { req }) {
                if (val !== req.body.password)
                    throw new Error(`${req.__('validation_password_match')}`);
                return true;
            })),
            validator_middleware_1.default
        ];
        this.getOne = [
            (0, express_validator_1.param)('id').isMongoId().withMessage((val, { req }) => req.__('invalid_id')),
            validator_middleware_1.default
        ];
        this.deleteOne = [
            (0, express_validator_1.param)('id').isMongoId().withMessage((val, { req }) => req.__('invalid_id')),
            validator_middleware_1.default
        ];
    }
}
const usersValidation = new UsersValidation();
exports.default = usersValidation;
