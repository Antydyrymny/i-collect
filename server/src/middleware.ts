import { Request, Response, NextFunction } from 'express';
import { ResponseError } from './types';

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    const error = new Error(`Not Found: ${req.originalUrl}`);
    next(error);
}

export function errorHandler(
    err: ResponseError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'dev' ? err.stack : undefined,
    });
}
