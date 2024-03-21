import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { globalErrorHandler } from './http/presentation/middlewares';
import { routesHandler } from './http/presentation/routes';
import { bullMq } from './http/domain/lib/bullmq';
import 'express-async-errors';
import 'dotenv/config';

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

routesHandler(app);

bullMq();

app.use(globalErrorHandler);

export default app;
