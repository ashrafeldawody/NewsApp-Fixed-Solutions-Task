import { json } from 'express';
import { userRouter } from './controllers/user.controller';
import { sourceRouter } from './controllers/sources.controller';
import {errorHandler} from "./middleware/errorHandler.middleware";
import {feedRouter} from "./controllers/feed.controller";

export function createRouters(app: any) {
    app.use(json());
    app.use('/api/users', userRouter);
    app.use('/api/sources', sourceRouter);
    app.use('/api/feed', feedRouter);
    app.use(errorHandler);
}