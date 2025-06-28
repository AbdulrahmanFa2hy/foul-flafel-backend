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
const crypto_1 = __importDefault(require("crypto"));
const users_schema_1 = __importDefault(require("../User/users.schema"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sanitization_1 = __importDefault(require("../../utils/sanitization"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_1 = __importDefault(require("../../utils/sendMail"));
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
class AuthService {
    constructor() {
        this.signup = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.default.create({
                username: req.body.username,
                name: req.body.name,
                password: req.body.password,
                // email: req.body.email,
                image: req.body.image,
                role: req.body.role,
            });
            const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
            res.status(201).json({
                message: "User created successfully",
                token,
                data: sanitization_1.default.User(user),
            });
        }));
        // signup = expressAsyncHandler(async(req:Request, res:Response, next:NextFunction) => {
        //     const user = await usersSchema.create({
        //         username: req.body.username,
        //         name: req.body.name,
        //         password: req.body.password,
        //         email: req.body.email,
        //         image: req.body.image
        //     });
        //     const token = createTokens.accessToken(user._id, user.role);
        //     res.status(201).json({message:"User created successfully", token, data: sanitization.User(user)});
        // });
        this.login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.default.findOne({ username: req.body.username });
            if (!user ||
                user.hasPassword === false ||
                !(yield bcryptjs_1.default.compare(req.body.password, user.password))) {
                return next(new apiErrors_1.default(`${req.__("validation_email_password")}`, 400));
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
            res.status(200).json({
                message: "User logged in successfully",
                token,
                data: sanitization_1.default.User(user),
            });
        }));
        // login = expressAsyncHandler(async(req:Request, res:Response, next:NextFunction) => {
        //     const user = await usersSchema.findOne({$or: [{username: req.body.username},{email: req.body.email}]});
        //     if(!user|| user.hasPassword == false || !(await bcrypt.compare(req.body.password, user.password)))
        //           return next(new ApiError(`${req.__('validation_email_password')}`, 400));
        //     const token = createTokens.accessToken(user._id, user.role);
        //     res.status(200).json({message:"User logged in successfully", token, data: sanitization.User(user)});
        // });
        this.adminLogin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.default.findOne({
                $or: [{ username: req.body.username }, { email: req.body.email }],
                role: { $in: ["admin", "employee"] },
            });
            if (!user ||
                user.hasPassword == false ||
                !(yield bcryptjs_1.default.compare(req.body.password, user.password)))
                return next(new apiErrors_1.default(`${req.__("invalid_login")}`, 400));
            const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
            res.status(200).json({
                message: "Admin logged in successfully",
                token,
                data: sanitization_1.default.User(user),
            });
        }));
        //     adminLogin = expressAsyncHandler(async(req:Request, res:Response, next:NextFunction) => {
        //         const user = await usersSchema.findOne({
        //             $or: [{username: req.body.username},{email: req.body.email}],
        //             role: {$in: ['admin', 'employee']}
        //         });
        //         if(!user || user.hasPassword == false || !(await bcrypt.compare(req.body.password, user.password)))
        //             return next (new ApiError(`${req.__('invalid_login')}`, 400));
        //         const token = createTokens.accessToken(user._id, user.role);
        //         res.status(200).json({message:"Admin logged in successfully", token, data: sanitization.User(user)});
        // });
        ////////////////////////////////////////////////////////////////////////////
        this.protectedRoutes = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const token = req.headers["token"];
            // console.log(token)
            // Check if token is provided
            if (!token) {
                return next(new apiErrors_1.default(`${req.__("check_login")}`, 401));
            }
            // Verify the token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // console.log(decoded)
            // Find user by ID
            const user = yield users_schema_1.default.findById(decoded._id);
            // console.log(user)
            // Check if user exists
            if (!user) {
                return next(new apiErrors_1.default(`${req.__("check_login")}`, 404));
            }
            // Check if the password has been changed
            if (user.passwordChangedAt instanceof Date) {
                const changePasswordTime = Math.trunc(user.passwordChangedAt.getTime() / 1000);
                if (changePasswordTime > decoded.iat) {
                    return next(new apiErrors_1.default(`${req.__("check_password_changed")}`, 401));
                }
            }
            // Attach user to the request
            req.user = user;
            next();
        }));
        this.forgetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.default.findOne({ email: req.body.email });
            if (!user)
                return next(new apiErrors_1.default(`${req.__("check_email")}`, 404));
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            // const cryptedCode = await bcrypt.hash(resetCode, 13);
            const cryptedCode = crypto_1.default
                .createHash("sha256")
                .update(resetCode)
                .digest("hex");
            const message = `Your reset code is: ${resetCode}`;
            const options = {
                message,
                email: user.email,
                subject: "Reset password",
            };
            try {
                yield (0, sendMail_1.default)(options);
                user.passwordResetCode = cryptedCode;
                user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000;
                user.passwordResetCodeVerify = false;
                if (user.image &&
                    user.image.startsWith(`${process.env.BASE_URL ||
                        "https://foul-flafel-backend-production.up.railway.app"}`))
                    user.image = user.image.split("/").pop();
                yield user.save({ validateModifiedOnly: true });
            }
            catch (e) {
                console.log(e);
                return next(new apiErrors_1.default(`${req.__("send_email")}`, 500)); // error server
            }
            const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET_RESET);
            res.status(200).json({ token, success: true });
        }));
        // forgetPassword = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        //     const user: any = await usersSchema.findOne({email: req.body.email});
        //     if (!user) return next(new ApiError(`${req.__('check_email')}`, 404));
        //     const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        //     // const cryptedCode = await bcrypt.hash(resetCode, 13);
        //     const cryptedCode = crypto.createHash('sha256').update(resetCode).digest('hex');
        //     const message = `Your reset code is: ${resetCode}`;
        //     const options = {
        //         message,
        //         email: user.email,
        //         subject: 'Reset password'
        //     }
        //     try {
        //         await sendEmail(options);
        //         user.passwordResetCode = cryptedCode;
        //         user.passwordResetCodeExpires = Date.now() + (10 * 60 * 1000);
        //         user.passwordResetCodeVerify = false;
        //         if (user.image && user.image.startsWith(`${process.env.BASE_URL}`)) user.image = user.image.split('/').pop();
        //         await user.save({validateModifiedOnly: true});
        //     } catch (e) {
        //         console.log(e);
        //         return next(new ApiError(`${req.__('send_email')}`, 500)); // error server
        //     }
        //     const token = createTokens.resetToken(user._id);
        //     res.status(200).json({token, success: true});
        // })
        this.verifyResetCode = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let token = "";
            if (req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer"))
                token = req.headers.authorization.split(" ")[1];
            else
                return next(new apiErrors_1.default(`${req.__("check_verify_code")}`, 403));
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_RESET);
            const hashedResetCode = crypto_1.default
                .createHash("sha256")
                .update(req.body.resetCode)
                .digest("hex");
            const user = yield users_schema_1.default.findOne({
                _id: decoded._id,
                passwordResetCode: hashedResetCode,
                passwordResetCodeExpires: { $gt: Date.now() },
            });
            if (!user)
                return next(new apiErrors_1.default(`${req.__("check_code_valid")}`, 403)); //
            user.passwordResetCodeVerify = true;
            if (user.image &&
                user.image.startsWith(`${process.env.BASE_URL ||
                    "https://foul-flafel-backend-production.up.railway.app"}`))
                user.image = user.image.split("/").pop();
            yield user.save({ validateModifiedOnly: true });
            res.status(200).json({ success: true });
        }));
        this.resetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let token = "";
            if (req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer"))
                token = req.headers.authorization.split(" ")[1];
            else
                return next(new apiErrors_1.default(`${req.__("check_reset_code")}`, 403));
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_RESET);
            const user = yield users_schema_1.default.findOne({
                _id: decoded._id,
                passwordResetCodeVerify: true,
            });
            if (!user)
                return next(new apiErrors_1.default(`${req.__("check_code_verify")}`, 403));
            user.password = req.body.password; // new password
            user.passwordResetCodeExpires = undefined;
            user.passwordResetCode = undefined;
            user.passwordResetCodeVerify = undefined;
            user.passwordChangedAt = Date.now();
            if (user.image &&
                user.image.startsWith(`${process.env.BASE_URL ||
                    "https://foul-flafel-backend-production.up.railway.app"}`))
                user.image = user.image.split("/").pop();
            yield user.save({ validateModifiedOnly: true });
            res.status(200).json({ success: true });
        }));
        this.allowedTo = (...roles) => (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!roles.includes(req.user.role))
                return next(new apiErrors_1.default(`${req.__("allowed_to")}`, 403));
            next();
        });
        this.checkActive = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user.active)
                return next(new apiErrors_1.default(`${req.__("check_active")}`, 403));
            next();
        }));
    }
}
const authService = new AuthService();
exports.default = authService;
