import passport from 'passport';
import passportJwt from 'passport-jwt';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../models';
import { ResponseError, UserModelType } from '../../types';

dotenv.config();

const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

const authenticateJWT = async (
    jwtPayload: { _id: string },
    done: passportJwt.VerifiedCallback
) => {
    try {
        const userAuthenticated = await UserModel.findOne({ _id: jwtPayload._id });
        if (!userAuthenticated) done(new ResponseError('Unauthorized', 401));
        else if (userAuthenticated.status === 'blocked')
            done(new ResponseError('Forbidden', 403));
        else done(null, userAuthenticated);
    } catch {
        done(new ResponseError('Error connecting to the database', 500));
    }
};

passport.use(new StrategyJwt(jwtOptions, authenticateJWT));

export const authMiddleware = passport.authenticate('jwt', { session: false });

export const protectedRoutesMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authMiddleware(req, res, (err: ResponseError) => {
        if (err) {
            next(err);
        } else next();
    });
};

export const adminRoutesMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authMiddleware(req, res, (err: ResponseError) => {
        if (err) {
            next(err);
        }
        const user = req.user as UserModelType;
        if (!user || !user.admin) {
            next(new ResponseError('Unauthorized', 401));
        } else next();
    });
};
