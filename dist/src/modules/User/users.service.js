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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const refactor_service_1 = __importDefault(require("../../refactor.service"));
const users_schema_1 = __importDefault(require("./users.schema"));
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const uploadFiles_middleware_1 = require("../../middleware/uploadFiles.middleware");
const sharp_1 = __importDefault(require("sharp"));
const sanitization_1 = __importDefault(require("../../utils/sanitization"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
class UsersService {
    constructor() {
        this.getAllUsers = refactor_service_1.default.getAll(users_schema_1.default, "Users");
        this.createUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.default.create(req.body);
            res.status(201).json({
                message: "User created successfully",
                data: sanitization_1.default.User(user),
            });
        }));
        this.getUserById = refactor_service_1.default.getOneById(users_schema_1.default);
        this.updateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.default.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            if (!user)
                return next(new apiErrors_1.default(`${req.__("not_found")}`, 404));
            res.status(200).json({
                message: "User updated successfully",
                data: sanitization_1.default.User(user),
            });
        }));
        this.changePassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.default.findByIdAndUpdate(req.params.id, {
                password: req.body.password,
                passwordChangedAt: Date.now(),
            }, { new: true });
            if (!user)
                return next(new apiErrors_1.default(`${req.__("not_found")}`, 404));
            res.status(200).json({
                message: "Password updated successfully",
                data: sanitization_1.default.User(user),
            });
        }));
        this.deleteUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.default.findByIdAndDelete(req.params.id);
            if (!user)
                return next(new apiErrors_1.default(`${req.__("not_found")}`, 404));
            // Check and delete image from cloudinary if applicable
            if (user.image &&
                typeof user.image === "object" &&
                "publicId" in user.image &&
                user.image.publicId) {
                const imageObj = user.image;
                try {
                    yield this.deleteImage(imageObj.publicId);
                }
                catch (error) {
                    console.log("Failed to delete user image from cloudinary", error);
                }
            }
            res.status(200).json({
                message: "User deleted successfully",
                data: sanitization_1.default.User(user),
            });
        }));
        this.uploadImage = (0, uploadFiles_middleware_1.uploadSingleFile)(["image"], "image");
        this.saveImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    const buffer = yield (0, sharp_1.default)(req.file.buffer)
                        .resize(1200, 1200)
                        .webp({ quality: 95 })
                        .toBuffer();
                    const uploadFromBuffer = (buffer) => {
                        return new Promise((resolve, reject) => {
                            const stream = cloudinary_1.default.uploader.upload_stream({
                                resource_type: "image",
                                folder: "user",
                                format: "webp",
                            }, (error, result) => {
                                if (error) {
                                    console.error("Cloudinary Error:", error);
                                    reject(error);
                                }
                                else {
                                    resolve(result);
                                }
                            });
                            stream.write(buffer);
                            stream.end();
                        });
                    };
                    const result = yield uploadFromBuffer(buffer);
                    req.body.image = {
                        url: result.secure_url,
                        publicId: result.public_id,
                    };
                }
                next();
            }
            catch (error) {
                console.error("Upload failed", error);
                return next(new apiErrors_1.default("Image upload failed", 500));
            }
        });
        this.deleteUserImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.default.findById(req.params.id);
            if (!user)
                return next(new apiErrors_1.default(`${req.__("not_found")}`, 404));
            if (user.image &&
                typeof user.image === "object" &&
                "publicId" in user.image &&
                user.image.publicId &&
                !user.image.url.startsWith(`${process.env.BASE_URL ||
                    "https://foul-flafel-backend-production.up.railway.app"}/images/user/user-default.png`)) {
                try {
                    yield this.deleteImage(user.image.publicId);
                    user.image = {
                        url: "user-default.png",
                        publicId: "",
                    };
                    yield user.save();
                }
                catch (error) {
                    return next(new apiErrors_1.default("Image upload failed", 500));
                }
            }
            res.status(200).json({
                message: "User image deleted successfully",
                data: sanitization_1.default.User(user),
            });
        }));
        this.updateImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    const oldImageId = req.body.oldImageId;
                    if (oldImageId) {
                        yield cloudinary_1.default.uploader.destroy(oldImageId, {
                            resource_type: "image",
                        });
                    }
                    const buffer = yield (0, sharp_1.default)(req.file.buffer)
                        .resize(1200, 1200)
                        .webp({ quality: 95 })
                        .toBuffer();
                    const uploadFromBuffer = (buffer) => {
                        return new Promise((resolve, reject) => {
                            const stream = cloudinary_1.default.uploader.upload_stream({
                                resource_type: "image",
                                folder: "user",
                                format: "webp",
                            }, (error, result) => {
                                if (error)
                                    return reject(error);
                                resolve(result);
                            });
                            stream.write(buffer);
                            stream.end();
                        });
                    };
                    const result = yield uploadFromBuffer(buffer);
                    req.body.image = {
                        url: result.secure_url,
                        publicId: result.public_id,
                    };
                }
                next();
            }
            catch (error) {
                console.error("Update failed", error);
                return next(new apiErrors_1.default("Image update failed", 500));
            }
        });
    }
    deleteImage(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield cloudinary_1.default.uploader.destroy(publicId);
            }
            catch (error) {
                console.log("Failed to delete user image from cloudinary", error);
                throw error;
            }
        });
    }
}
const usersService = new UsersService();
exports.default = usersService;
