import { json } from 'express';
import { userRouter } from './controllers/user.controller';
import {errorHandler} from "./middleware/errorHandler.middleware";




export function createRouters(app: any) {
    app.use(json());
    app.use('/api/users', userRouter);
    app.use(errorHandler);
}