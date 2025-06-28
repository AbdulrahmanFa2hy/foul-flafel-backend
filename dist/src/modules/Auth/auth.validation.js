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
const users_schema_1 = __importDefault(require("../User/users.schema"));
class AuthValidation {
    constructor() {
        this.signup = [
            (0, express_validator_1.body)('username').notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 2, max: 50 }).withMessage((val, { req }) => req.__('validation_length_short'))
                .custom((val_1, _a) => __awaiter(this, [val_1, _a], void 0, function* (val, { req }) {
                const user = yield users_schema_1.default.findOne({ username: val });
                if (user)
                    throw new Error(`${req.__('validation_email_check')}`);
                return true;
            })),
            // body('email').notEmpty().withMessage((val, {req}) => req.__('validation_field'))
            //     .isEmail().withMessage((val, {req}) => req.__('validation_value'))
            //     .custom(async (val: string, {req}) => {
            //         const user = await usersSchema.findOne({email: val});
            //         if (user) throw new Error(`${req.__('validation_email_check')}`);
            //         return true;
            //     }),
            (0, express_validator_1.body)('name')
                .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 2, max: 50 }).withMessage((val, { req }) => req.__('validation_length_short')),
            (0, express_validator_1.body)('password')
                .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 6, max: 20 }).withMessage((val, { req }) => req.__('validation_length_password')),
            (0, express_validator_1.body)('role').notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isIn(['admin', 'manager', 'cashier']).withMessage((val, { req }) => req.__('validation_role')),
            validator_middleware_1.default
        ];
        this.login = [
            (0, express_validator_1.body)('username').notEmpty().withMessage((val, { req }) => req.__('validation_field')),
            (0, express_validator_1.body)('password')
                .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 6, max: 20 }).withMessage((val, { req }) => req.__('validation_length_password')),
            validator_middleware_1.default
        ];
        this.forgetPassword = [
            (0, express_validator_1.body)('email')
                .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isEmail().withMessage((val, { req }) => req.__('validation_value')),
            validator_middleware_1.default
        ];
        this.changePassword = [
            (0, express_validator_1.body)('password')
                .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 6, max: 20 }).withMessage((val, { req }) => req.__('validation_length_password')),
            (0, express_validator_1.body)('confirmPassword')
                .notEmpty().withMessage((val, { req }) => req.__('validation_field'))
                .isLength({ min: 6, max: 20 }).withMessage((val, { req }) => req.__('validation_length_password'))
                .custom((val, { req }) => {
                if (val !== req.body.password)
                    throw new Error(`${req.__('validation_password_match')}`);
                return true;
            }),
            validator_middleware_1.default
        ];
    }
}
const authValidation = new AuthValidation();
exports.default = authValidation;
