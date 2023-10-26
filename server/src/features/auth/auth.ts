import passport from 'passport';
import passportJwt from 'passport-jwt';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '../../middleware';
import { UserModel } from '../../models';

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
        if (userAuthenticated) done(null, userAuthenticated);
    } catch (error) {
        done(error);
    }
};

passport.use(new StrategyJwt(jwtOptions, authenticateJWT));

const authMiddleware = passport.authenticate('jwt', { session: false });

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
