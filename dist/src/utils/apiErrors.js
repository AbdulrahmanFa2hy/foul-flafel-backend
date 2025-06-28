"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    // private isOperational : boolean;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // this.isOperational = true;
    }
    ;
}
exports.default = ApiError;
