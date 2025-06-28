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
const apiErrors_1 = __importDefault(require("./utils/apiErrors"));
const features_1 = __importDefault(require("./utils/features"));
const sanitization_1 = __importDefault(require("./utils/sanitization"));
class RefactorService {
    constructor() {
        this.getAll = (model, modelName) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let filterData = {};
            if (req.filterData)
                filterData = req.filterData;
            const documentCount = yield model.find(filterData).countDocuments();
            const features = new features_1.default(model.find(filterData), req.query).sort().limitFields().search(modelName).pagination(documentCount).filter();
            const { mongoQuery, paginationResult } = features;
            const documents = yield mongoQuery;
            res.status(200).json({ message: "All documents fetched successfully", pagination: paginationResult, countOfDocuments: documents.length, documents });
        }));
        this.getOneById = (model, modelName, populationOptions) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let query = model.findById(req.params.id); // Built 
            if (populationOptions)
                query = query.populate(populationOptions);
            let document = yield query; // async
            if (!document)
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            if (modelName === 'Users')
                document = sanitization_1.default.User(document);
            res.status(200).json({ data: document });
        }));
        this.createOne = (model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const document = yield model.create(req.body);
            if (!document) {
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            }
            res.status(201).json({ message: "Document created successfully", document });
        }));
        this.updateOne = (model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const document = yield model.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            if (!document)
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            res.status(200).json({ message: "Document updated successfully", document });
        }));
        this.deleteOne = (model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const document = yield model.findByIdAndDelete(req.params.id);
            if (!document) {
                return next(new apiErrors_1.default(`${req.__('not_found')}`, 404));
            }
            res.status(200).json({ message: "Document deleted successfully", document });
        }));
    }
}
const refactorService = new RefactorService();
exports.default = refactorService;
