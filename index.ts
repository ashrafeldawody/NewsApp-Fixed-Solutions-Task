import express, { Express, Request, Response } from 'express';
import {port} from './config';
import DBConnect from './services/database';
import { createRouters } from './routes';

const app: Express = express();
DBConnect();
createRouters(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
