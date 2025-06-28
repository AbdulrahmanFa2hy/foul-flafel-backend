"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
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
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    // origin: (origin, callback) => {
    //   const allowedOrigins = ['*'];
    //   if (!origin || allowedOrigins.includes(origin)) {
    //     callback(null, true);
    //   } else {
    //     callback(new ApiError('Not allowed by CORS', 403));
    //   }
    // },
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
}));
app.use(express_1.default.json({ limit: '10kb' }));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'same-site' } }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
let server;
dotenv_1.default.config();
app.use(express_1.default.static('uploads'));
// http://localhost:4000/images/products/products.1736378718753-cover.webp
app.use((0, hpp_1.default)({
    whitelist: ['price']
}));
i18n_1.default.configure({
    locales: ['en', 'ar'],
    directory: path_1.default.join(__dirname, 'locales'),
    defaultLocale: 'en',
    queryParameter: 'lang',
});
app.use(i18n_1.default.init);
(0, database_1.default)();
(0, src_1.default)(app);
app.get('/', function (req, res) {
    res.send('Hello World !!');
});
server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT} `);
});
process.on('unhandledRejection', (err) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(err);
    }
    console.log(`unhandledRejection ${err.name} | ${err.message}`);
    server.close(() => {
        console.log('shutting down the server ');
        process.exit(1);
    });
});
