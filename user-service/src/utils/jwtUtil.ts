import jsonwebtoken from 'jsonwebtoken';

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
