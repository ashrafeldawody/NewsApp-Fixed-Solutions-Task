import { Request, Response, Router } from 'express';
import {getNewsAndArticles} from "../services/newsapi";
import {auth} from "../middleware/auth.middleware";
import UserModel from "../models/user.model";

export const feedRouter = Router();

feedRouter.get('',auth, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await UserModel.findById(req.user._id);
    if(user.subscriptions.length === 0)
        return res.status(400).json({message: 'You have no subscriptions'});

    let page = req.query.page ? req.query.page as string : "1";
    const news = await getNewsAndArticles(user.subscriptions,page);
    res.json(news);
});