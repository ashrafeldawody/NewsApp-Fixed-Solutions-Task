import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { jwtSecret } from '../config';
import {checkBlacklisted} from "../services/auth-blacklist";

export async function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.header('x-auth-token') || req.header('authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    if(await checkBlacklisted(token)){
        return res.status(401).json({ message: 'Invalid Token, authorization denied' });
    }
    try {
        // @ts-ignore
        req.user = verify(token, jwtSecret);
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}
