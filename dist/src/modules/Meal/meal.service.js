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
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
const meal_schema_1 = __importDefault(require("./meal.schema"));
const uploadFiles_middleware_1 = require("../../middleware/uploadFiles.middleware");
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const stockResolver_service_1 = require("../Stock/stockResolver.service");
class MealsService {
    constructor() {
        this.createMeals = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // تحويل البيانات الواردة
                const ingredients = this.parseIngredients(req.body);
                // حل المراجع إلى أحدث مخزون
                const resolvedIngredients = yield (0, stockResolver_service_1.resolveStockItems)(ingredients);
                const meal = yield meal_schema_1.default.create(Object.assign(Object.assign({}, req.body), { ingredients: resolvedIngredients }));
                yield meal.populate([
                    { path: "categoryId", select: "name" },
                    { path: "ingredients.stockItemId", select: "name quantity unit " },
                ]);
                res.status(201).json({
                    success: true,
                    message: "Meal created successfully",
                    data: meal,
                });
            }
            catch (error) {
                next(error);
            }
        }));
        this.getMealById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const meal = yield meal_schema_1.default.findById(req.params.id);
            if (!meal) {
                return next(new apiErrors_1.default(`${req.__("not_found")}`, 404));
            }
            res
                .status(200)
                .json({ message: "Meal fetched successfully", data: meal });
        }));
        this.getAllMeals = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const meals = yield meal_schema_1.default.find();
            if (!meals) {
                return next(new apiErrors_1.default(`${req.__("not_found")}`, 404));
            }
            res
                .status(200)
                .json({ message: "Meals fetched successfully", data: meals });
        }));
        this.updateMeal = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const meal = yield meal_schema_1.default.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            if (!meal) {
                return next(new apiErrors_1.default(`${req.__("not_found")}`, 404));
            }
            res
                .status(200)
                .json({ message: "Meal updated successfully", data: meal });
        }));
        this.deleteMeal = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const meal = yield meal_schema_1.default.findByIdAndDelete(req.params.id);
            if (!meal) {
                return next(new apiErrors_1.default(`${req.__("not_found")}`, 404));
            }
            res
                .status(200)
                .json({ message: "Meal deleted successfully", data: meal });
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
                                folder: "meal",
                                format: "webp",
                            }, (error, result) => {
                                if (error) {
                                    console.error("Cloudinary Error:", error); // Debug
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
        this.deleteMealImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const meal = yield meal_schema_1.default.findById(req.params.id);
            if (!meal)
                return next(new apiErrors_1.default(`${req.__("not_found")}`, 404));
            if (meal.image &&
                typeof meal.image === "object" &&
                "publicId" in meal.image &&
                meal.image.publicId &&
                !meal.image.url.startsWith(`${process.env.BASE_URL ||
                    "https://foul-flafel-backend-production.up.railway.app"}/images/meal/meal-default.png`)) {
                try {
                    yield this.deleteImage(meal.image.publicId);
                    meal.image = {
                        url: "meal-default.png",
                        publicId: "",
                    };
                    yield meal.save();
                }
                catch (error) {
                    return next(new apiErrors_1.default("Image upload failed", 500));
                }
            }
            res
                .status(200)
                .json({ message: "User image deleted successfully", data: meal });
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
                                folder: "meal",
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
    parseIngredients(body) {
        const ingredients = body.ingredients || [];
        Object.keys(body).forEach((key) => {
            const match = key.match(/^ingredients\[(\d+)]\[(\w+)]$/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                if (!ingredients[index]) {
                    ingredients[index] = {};
                }
                const mappedField = field === "stockItem" ? "stockName" : field;
                ingredients[index][mappedField] = body[key];
            }
        });
        return ingredients.map((item) => ({
            stockName: item.stockName || item.stockItem,
            quantityUsed: item.quantityUsed ? parseFloat(item.quantityUsed) : 0,
            unit: item.unit || "pcs",
        }));
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
const mealsService = new MealsService();
exports.default = mealsService;
