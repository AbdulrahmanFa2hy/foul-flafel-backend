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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_interface_1 = require("./users.interface");
const usersSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        trim: true,
        enum: Object.values(users_interface_1.UserRoles),
        required: true,
    },
    active: { type: Boolean, trim: true, default: true },
    hasPassword: { type: Boolean, trim: true, default: true },
    passwordChangedAt: { type: Date, trim: true },
    passwordResetCode: { type: String, trim: true },
    passwordResetCodeExpires: { type: Date, trim: true },
    passwordResetCodeVerified: { type: Boolean, trim: true },
    // shiftStartTime: { type: String },
    // shiftEndTime: { type: String },
    // shiftDays: [
    //   { type: String, enum: Object.values(ShiftsDaysEnum) }
    // ],
    image: {
        url: { type: String, default: "user-default.png" },
        publicId: { type: String, default: "" },
    },
}, { timestamps: true });
// Format image URL
const imagesUrl = (document) => {
    if (document.image &&
        typeof document.image === "object" &&
        "url" in document.image &&
        typeof document.image.url === "string" &&
        document.image.url.startsWith("user")) {
        document.image.url = `${process.env.BASE_URL ||
            "https://foul-flafel-backend-production.up.railway.app"}/images/user/${document.image.url}`;
    }
};
usersSchema.post("init", imagesUrl).post("save", imagesUrl);
usersSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, 13);
        next();
    });
});
exports.default = mongoose_1.default.model("User", usersSchema);
