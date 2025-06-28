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
const zod_1 = require("zod");
const category_schema_1 = __importDefault(require("./category.schema"));
const category_validation_1 = require("./category.validation");
class CategoryService {
    constructor() {
        this.addCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = category_validation_1.addCategorySchema.parse(req.body);
                const category = yield category_schema_1.default.create(validatedData);
                if (!category) {
                    return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
                }
                res.status(201).json({ message: "Category created successfully", data: category });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return next(new apiErrors_1.default(error.errors.map((err) => err.message).join(', '), 400));
                }
                return next(error);
            }
        }));
        this.getCategoryById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const category = yield category_schema_1.default.findById(req.params.id);
            if (!category) {
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            }
            res.status(200).json({ message: "Category fetched successfully", data: category });
        }));
        this.getAllCategories = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const categories = yield category_schema_1.default.find();
            if (!categories) {
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            }
            res.status(200).json({ message: "Categories fetched successfully", data: categories });
        }));
        this.updateCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = category_validation_1.updateCategorySchema.parse(req.body);
                const category = yield category_schema_1.default.findByIdAndUpdate(req.params.id, validatedData, { new: true });
                if (!category) {
                    return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
                }
                res.status(200).json({ message: "Category updated successfully", data: category });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return next(new apiErrors_1.default(error.errors.map((err) => err.message).join(', '), 400));
                }
                return next(error);
            }
        }));
        this.deleteCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const category = yield category_schema_1.default.findByIdAndDelete(req.params.id);
            if (!category) {
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            }
            res.status(200).json({ message: "Category deleted successfully", data: category });
        }));
    }
}
const categoryService = new CategoryService();
exports.default = categoryService;
