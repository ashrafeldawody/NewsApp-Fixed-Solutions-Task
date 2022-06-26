import { Request, Response, NextFunction } from 'express';


export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    res.status(500).send('Something went wrong');
}
