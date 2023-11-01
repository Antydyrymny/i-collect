import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';
import { ResponseError } from '../types';

const validate =
    (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate({
                body: req.body,
                query: req.query,
                params: req.params,
            });
        } catch (err) {
            next(new ResponseError(err, 400));
        }

        next();
    };

export default validate;
