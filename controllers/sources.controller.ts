import { Request, Response, Router } from 'express';
import { compare,hash } from 'bcrypt';
import { userValidator } from '../validators/user.validator';
import {auth} from '../middleware/auth.middleware';
import { getSources } from '../services/newsapi';
export const sourceRouter = Router();

sourceRouter.get('/', async (req: Request, res: Response) => {
    const sources = await getSources();
    res.send(sources);
})
sourceRouter.get('/subscribe/:sourceId', async (req: Request, res: Response) => {
    
});