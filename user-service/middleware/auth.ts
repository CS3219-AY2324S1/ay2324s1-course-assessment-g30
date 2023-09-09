import jsonwebtoken from 'jsonwebtoken';
import { JwtToken } from '../types/auth';
import { NextFunction, Response, Request } from 'express';

const authJwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET as string,
      (err, token) => {
        if (err || !token) {
          console.log(err);
          return res.sendStatus(403);
        }

        token = token as JwtToken;
        req.user = { ...req.user, email: token.email };

        next();
      }
    );
  } else {
    res.sendStatus(401);
  }
};

export default authJwtMiddleware;
