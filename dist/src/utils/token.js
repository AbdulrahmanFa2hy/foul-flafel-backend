"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class CreateTokens {
    constructor() {
        this.accessToken = (id, role) => jsonwebtoken_1.default.sign({ _id: id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        this.resetToken = (id) => jsonwebtoken_1.default.sign({ _id: id }, process.env.JWT_SECRET_RESET, { expiresIn: process.env.JWT_EXPIRE_RESET });
    }
}
const createTokens = new CreateTokens();
exports.default = createTokens;
