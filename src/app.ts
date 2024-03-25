import express, { Express, Request } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import { globalErrorHandler } from './http/presentation/middlewares';
import { routesHandler } from './http/presentation/routes';
import { bullMq } from './http/domain/lib/bullmq';
import { fileFilter, storage } from './config/multer';
import 'express-async-errors';
import 'dotenv/config';

const app: Express = express();

export const upload = multer({
  dest: './src/temp', fileFilter, storage, limits: { fileSize: 1024 * 1024 * 5 },
});

app.use(cors());
app.use(bodyParser.json());

routesHandler(app);

bullMq();

app.use(globalErrorHandler);

export default app;
