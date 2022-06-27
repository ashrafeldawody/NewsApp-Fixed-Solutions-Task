import { Request, Response, Router } from 'express';
import {auth} from '../middleware/auth.middleware';
import {getSource, getSources} from '../services/newsapi';
import UserModel from "../models/user.model";
export const sourceRouter = Router();

sourceRouter.get('/', async (req: Request, res: Response) => {
    const sources = await getSources();
    res.json(sources);
})

sourceRouter.post('/subscribe/:sourceId',auth ,async (req: Request, res: Response) => {
    const source = await getSource(req.params.sourceId);

    if (!source)
        return res.status(404).json({message: 'Source not found'});

    // @ts-ignore
    const user = await UserModel.findById(req.user._id);

    if (!user)
        return res.status(404).json({message: 'User not found'});

    if (user.subscriptions.includes(req.params.sourceId))
        return res.status(400).json({message: 'You already subscribed to this source'});

    user.subscriptions.push(req.params.sourceId);
    await user.save();

    return res.json({message: 'You subscribed to this source'});

});
sourceRouter.post('/unsubscribe/:sourceId',auth ,async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await UserModel.findById(req.user._id);

    if (!user.subscriptions.includes(req.params.sourceId))
        return res.status(400).json({message: 'You are not subscribed to this source'});

    user.subscriptions = user.subscriptions.filter((sourceId:string) => sourceId !== req.params.sourceId);
    await user.save();

    return res.json({message: 'You unsubscribed from this source'});

});