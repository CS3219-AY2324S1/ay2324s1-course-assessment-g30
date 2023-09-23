import { RequestHandler } from 'express';
import User from '../models/User';
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
  const role = await User.findOne({
    attributes: ['role'],
    where: {
      uuid
    }
  });

  if (!role) {
    sendBadRequestResponse(res, 'User does not exist');
    return;
  }

  sendSuccessResponse(res, role);
};

export { getUserRole };
