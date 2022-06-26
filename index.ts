import express, { Express, Request, Response } from 'express';
import {port} from './config';
import DBConnect from './services/database';
import { createRouters } from './routes';

const app: Express = express();
createRouters(app);
DBConnect();
app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
