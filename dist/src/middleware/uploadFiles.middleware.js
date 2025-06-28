"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiFiles = exports.uploadSingleFile = void 0;
const multer_1 = __importDefault(require("multer"));
const apiErrors_1 = __importDefault(require("../utils/apiErrors"));
const uploadOptions = (fileTypes) => {
    const multerStorage = multer_1.default.memoryStorage();
    const multerFilter = function (req, file, cb) {
        const isValidType = fileTypes.some((type) => file.mimetype.startsWith(type));
        if (isValidType) {
            cb(null, true);
        }
        else {
            cb(new apiErrors_1.default('the file type is not allowed', 400));
        }
    };
    return (0, multer_1.default)({ storage: multerStorage, fileFilter: multerFilter });
};
const uploadSingleFile = (fileTypes, fieldName) => uploadOptions(fileTypes).single(fieldName);
exports.uploadSingleFile = uploadSingleFile;
const uploadMultiFiles = (fileTypes, fields) => uploadOptions(fileTypes).fields(fields);
exports.uploadMultiFiles = uploadMultiFiles;
