import { Request, Response, Router } from 'express';
import {getNewsAndArticles} from "../services/newsapi";
import {auth} from "../middleware/auth.middleware";
import UserModel from "../models/user.model";

export const feedRouter = Router();

feedRouter.get('/',auth, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await UserModel.findById(req.user._id);

    if(!user)
        return res.status(404).json({message: 'User not found'});

    const news = await getNewsAndArticles(user.subscriptions);
    res.json(news);
});