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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const database_1 = __importDefault(require("./src/config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
const src_1 = __importDefault(require("./src"));
const i18n_1 = __importDefault(require("i18n"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://foul-flafe-frontend.netlify.app',
    'https://foul-flafel-front-end.vercel.app',
].join(',')).split(',').map(origin => origin.trim()).filter(Boolean);
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
}));
app.use(express_1.default.json({ limit: '10kb' }));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
let server;
app.use(express_1.default.static('uploads'));
// http://localhost:4000/images/products/products.1736378718753-cover.webp
app.use((0, hpp_1.default)({
    whitelist: ['price']
}));
i18n_1.default.configure({
    locales: ['en', 'ar'],
    directory: (0, fs_1.existsSync)(path_1.default.join(__dirname, 'locales'))
        ? path_1.default.join(__dirname, 'locales')
        : path_1.default.join(__dirname, '..', 'locales'),
    defaultLocale: 'en',
    queryParameter: 'lang',
});
app.use(i18n_1.default.init);
app.get('/health', (_req, res) => {
    const connected = mongoose_1.default.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({
        status: connected ? 'ok' : 'unavailable',
        database: connected ? 'connected' : 'disconnected',
    });
});
(0, src_1.default)(app);
app.get('/', function (req, res) {
    res.send('Hello World !!');
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.default)();
        const port = Number(process.env.PORT || 3333);
        server = app.listen(port, '0.0.0.0', () => {
            console.log(`Server running on port ${port} `);
        });
    }
    catch (error) {
        console.error('Unable to connect to MongoDB', error);
        process.exit(1);
    }
});
startServer();
process.on('unhandledRejection', (err) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(err);
    }
    console.log(`unhandledRejection ${err.name} | ${err.message}`);
    if (server) {
        server.close(() => {
            console.log('shutting down the server ');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
