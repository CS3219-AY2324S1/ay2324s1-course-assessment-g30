import jsonwebtoken from 'jsonwebtoken';
import { JwtToken } from '../types/auth';
import { NextFunction, Response, Request } from 'express';
import { HTTP_ERROR_CODES } from '../constants';
import { sendForbiddenErrorResponse } from '../utils';

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
          return sendForbiddenErrorResponse(res, 'Invalid Token');
        }

        token = token as JwtToken;
        req.user = { ...req.user, uuid: token.uuid };

        next();
      }
    );
  } else {
    res.sendStatus(HTTP_ERROR_CODES.UNAUTHORIZED);
  }
};

export default authJwtMiddleware;
