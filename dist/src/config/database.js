"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnection = async () => {
    const mongoUri = process.env.MONGODB_URI?.trim() || process.env.DB?.trim();
    if (!mongoUri) {
        throw new Error("MongoDB connection string is missing. Set MONGODB_URI.");
    }
    await mongoose_1.default.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
    });
    console.log("DB connected successfully");
};
exports.default = dbConnection;
