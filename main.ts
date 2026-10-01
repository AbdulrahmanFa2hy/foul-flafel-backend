import { Server } from 'http';
import express from 'express'
import path from 'path';
import { existsSync } from 'fs';
import dbConnection from './src/config/database';
import dotenv from 'dotenv';
import Routes from './src';
import i18n from 'i18n';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import expressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import csrf from 'csurf'
import morgan from 'morgan';
import ApiError from './src/utils/apiErrors';
import mongoose from 'mongoose';

const app: express.Application = express();

dotenv.config();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://foul-flafe-frontend.netlify.app',
  'https://foul-flafel-front-end.vercel.app',
].join(',')).split(',').map(origin => origin.trim()).filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  allowedHeaders: ['Content-Type', 'Authorization','X-CSRF-Token'],
  methods : ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials : true 
}));

app.use(express.json({ limit : '10kb' }));
app.use(expressMongoSanitize())
app.use(helmet({crossOriginResourcePolicy : {policy: 'cross-origin'}}));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));

let server : Server;
app.use(express.static('uploads'))
// http://localhost:4000/images/products/products.1736378718753-cover.webp



app.use(hpp({
  whitelist : ['price']
}));

i18n.configure({
  locales: ['en', 'ar'],
  directory: existsSync(path.join(__dirname, 'locales'))
    ? path.join(__dirname, 'locales')
    : path.join(__dirname, '..', 'locales'),
  defaultLocale: 'en',
  queryParameter: 'lang',
})

app.use(i18n.init);

app.get('/health', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    database: connected ? 'connected' : 'disconnected',
  });
});

Routes(app);

app.get('/', function (req : express.Request, res: express.Response) : void {
  res.send('Hello World !!')
})

const startServer = async (): Promise<void> => {
  try {
    await dbConnection();
    const port = Number(process.env.PORT || 3333);
    server = app.listen(port, '0.0.0.0', ()  => {
      console.log(`Server running on port ${port} `);
    });
  } catch (error) {
    console.error('Unable to connect to MongoDB', error);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err : Error)  => {
  if (process.env.NODE_ENV === 'development') { 
    console.log(err);
  }
  console.log  (`unhandledRejection ${err.name} | ${err.message}`);
  if (server) {
    server.close(()  => {
      console.log('shutting down the server ');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
})
