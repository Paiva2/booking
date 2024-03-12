import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { routesHandler } from './http/presentation/routes';
import 'express-async-errors';
import 'dotenv/config';

const app: Express = express();
app.use(bodyParser.json());

routesHandler(app);

export default app;
