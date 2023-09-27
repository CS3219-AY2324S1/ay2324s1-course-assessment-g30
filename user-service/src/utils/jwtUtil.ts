import jsonwebtoken from 'jsonwebtoken';
import { JwtToken } from 'types/auth';

// const verifyJwt = jsonwebtoken.verify(
//   token,
//   process.env.JWT_SECRET as string,
//   (err, token) => {
//     if (err || !token) {
//       console.log(err);
//       return res.sendStatus(HTTP_ERROR_CODES.FORBIDDEN);
//     }

//     token = token as JwtToken;
//     req.user = { ...req.user, uuid: token.uuid };

//     next();
//   }
// );

const verifyValidToken = (token: string) => {
  try {
    jsonwebtoken.verify(token, process.env.JWT_SECRET as string);
    return true;
  } catch {
    return false;
  }
};

const getUserUuid = (token: string) => {
  try {
    const verifiedToken = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jsonwebtoken.JwtPayload;
    console.log(verifiedToken);
    return verifiedToken.uuid;
  } catch (err) {
    return '';
  }
};

export { verifyValidToken, getUserUuid };
