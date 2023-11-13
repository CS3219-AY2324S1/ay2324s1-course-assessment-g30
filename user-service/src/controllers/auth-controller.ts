import { RequestHandler } from 'express';
import { UserDb } from '../db/Users';
import { sendBadRequestResponse, sendSuccessResponse } from '../utils';
import { getUserUuid, verifyValidToken } from '../utils/jwtUtil';

const getUserRole: RequestHandler = async (req, res) => {
  const token = req.body.token;
  if (!token || !verifyValidToken(token)) {
    sendBadRequestResponse(res, 'Invalid Token');
    return;
  }
  const uuid = getUserUuid(token);
  console.log('uuid', uuid);
  const role = (await UserDb.getRegisteredUserByUuid(uuid))?.role

  if (!role) {
    sendBadRequestResponse(res, 'User does not exist');
    return;
  }

  sendSuccessResponse(res, { role });
};

export { getUserRole };
