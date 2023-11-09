import passport from 'passport';
import passportJwt from 'passport-jwt';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { blackList } from '../../data';
import { AuthUser, JWTPayload, ResponseError } from '../../types';

dotenv.config();

const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

const authenticateJWT = (jwtPayload: JWTPayload, done: passportJwt.VerifiedCallback) => {
    if (blackList.has(jwtPayload._id)) done(new ResponseError('Forbidden', 403));
    else {
        done(null, jwtPayload);
    }
};

passport.use(new StrategyJwt(jwtOptions, authenticateJWT));

export const authMiddleware = passport.authenticate('jwt', {
    session: false,
    failWithError: true,
});

export const protectedRoutesMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authMiddleware(req, res, (err: ResponseError) => {
        if (err) {
            next(new ResponseError('Unauthorized', 401));
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
            next(next(new ResponseError('Unauthorized', 401)));
        }
        const user = req.user as AuthUser;
        if (!user || !user.admin) {
            next(new ResponseError('Unauthorized', 401));
        } else next();
    });
};
