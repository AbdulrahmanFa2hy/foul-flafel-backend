"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const devErrors = (err, res) => {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: 'البيانات المدخلة غير صحيحة',
            success: false,
            errors: err.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        success: false,
        stack: err.stack
    });
};
const prodErrors = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};
// const handleJwtExpiredError = (message: string , res: express.Response)  => new ApiError(message, 401);
// const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'Error';
//     if(err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') err = handleJwtExpiredError(`${req.__('session_expired')}`, res);
//     if (process.env.NODE_ENV === 'development') {
//         devErrors(err, res);
//     } else {
//         prodErrors(err, res);
//     }
// };
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';
    if (process.env.NODE_ENV === 'development') {
        devErrors(err, res);
    }
    else {
        prodErrors(err, res);
    }
};
exports.default = globalErrorHandler;
