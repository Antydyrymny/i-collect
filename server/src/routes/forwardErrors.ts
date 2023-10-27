import { Request, Response, NextFunction } from 'express';

export const forwardErrors =
    (action: (req: Request, res: Response, next?: NextFunction) => Promise<void>) =>
    (req: Request, res: Response, next: NextFunction) =>
        action(req, res).catch(next);
