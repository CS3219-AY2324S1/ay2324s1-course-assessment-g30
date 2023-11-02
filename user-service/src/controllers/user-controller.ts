import { RequestHandler } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { REQUEST_ERROR_MESSAGES, TOKEN_DURATION } from '../constants';
import jsonwebtoken, { Jwt, JwtPayload } from 'jsonwebtoken';
import {
  sendBadRequestResponse,
  sendForbiddenErrorResponse,
  sendInternalServerErrorResponse,
  sendSuccessResponse,
  sendUnexpectedMissingUserResponse
} from '../utils';
import { ValidationError } from 'sequelize';
import { isValidPassword } from '../utils/validators';
import { UserDb } from '../db/Users';

const createUser: RequestHandler = async (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  if (!username || !password || !email) {
    sendBadRequestResponse(res, REQUEST_ERROR_MESSAGES.MISSING_FIELDS_ERROR);
    return;
  }

  const lowerCasedUsername = (username as string).toLowerCase();
  // Check if username exists
  let registeredUser = await User.findOne({
    where: {
      username: lowerCasedUsername
    }
  });
  if (registeredUser) {
    sendBadRequestResponse(res, REQUEST_ERROR_MESSAGES.USERNAME_IN_USE_ERROR);
    return;
  }

  // Check if email exists
  registeredUser = await User.findOne({
    where: {
      email
    }
  });

  if (registeredUser) {
    sendBadRequestResponse(res, REQUEST_ERROR_MESSAGES.EMAIL_IN_USE_ERROR);
    return;
  }

  if (!isValidPassword(password)) {
    sendBadRequestResponse(res, 'Invalid password provided');
    return;
  }

  try {
    console.log('Adding to db');
    await UserDb.createUser(username, firstName, lastName, password, email);
    res.json({ err: '', res: 'Account created successfully' });
  } catch (err) {
    if (err instanceof ValidationError) {
      sendBadRequestResponse(res, REQUEST_ERROR_MESSAGES.INVALID_FIELD_ERROR);
    } else {
      sendInternalServerErrorResponse(res, REQUEST_ERROR_MESSAGES.DB_FAILURE);
    }
  }
};

const loginUser: RequestHandler = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    sendBadRequestResponse(res, REQUEST_ERROR_MESSAGES.MISSING_FIELDS_ERROR);
    return;
  }

  // Fetch username, and hash password
  const registeredUser = await User.findOne({
    where: {
      email
    }
  });

  if (!registeredUser) {
    sendForbiddenErrorResponse(res, 'User does not exist');
    return;
  }
  const hasCorrectPassword = await bcrypt.compare(
    password,
    registeredUser.hashedPassword
  );

  if (!hasCorrectPassword) {
    sendForbiddenErrorResponse(res, 'Incorrect password for user account');
    return;
  }

  const accessToken = jsonwebtoken.sign(
    { uuid: registeredUser.uuid },
    process.env.JWT_SECRET as string,
    { expiresIn: TOKEN_DURATION }
  );
  const tokenDecoded = jsonwebtoken.decode(accessToken, {
    complete: true
  }) as Jwt;
  const payload = tokenDecoded.payload as JwtPayload;
  const exp = payload.exp as number;

  res.json({
    err: '',
    res: {
      accessToken: accessToken,
      uuid: registeredUser.uuid,
      exp
    }
  });
};

const getUserProfile: RequestHandler = async (req, res) => {
  const user = req.user;
  if (!user) {
    sendUnexpectedMissingUserResponse(res);
    return;
  }

  if (user.uuid != req.body.uuid) {
    sendForbiddenErrorResponse(res, 'Forbidden');
    return;
  }

  const userData = await User.findByPk(user.uuid);
  if (userData) {
    const { username, email, firstName, lastName } = userData;
    const nonSensitiveUserData = { email, username, firstName, lastName };
    res.json({ err: '', res: nonSensitiveUserData });
  } else {
    sendUnexpectedMissingUserResponse(res);
    return;
  }
};

const updateUserProfile: RequestHandler = async (req, res) => {
  const user = req.user;
  if (!user) {
    sendUnexpectedMissingUserResponse(res);
    return;
  }

  if (user.uuid != req.body.uuid) {
    sendForbiddenErrorResponse(res, 'Forbidden');
    return;
  }

  const userData = await User.findByPk(user.uuid);
  if (userData) {
    let { username, firstName, lastName } = req.body;

    if (username && typeof username == 'string') {
      userData.username = username.toLowerCase();

      const registeredUser = await User.findOne({
        where: {
          username: userData.username
        }
      });
      if (registeredUser) {
        sendBadRequestResponse(
          res,
          REQUEST_ERROR_MESSAGES.USERNAME_IN_USE_ERROR
        );
        return;
      }
    }

    if (firstName && typeof firstName == 'string') {
      userData.firstName = firstName;
    }

    if (lastName && typeof lastName == 'string') {
      userData.lastName = lastName;
    }

    try {
      await userData.save();
    } catch (err) {
      if (err instanceof ValidationError) {
        sendBadRequestResponse(res, REQUEST_ERROR_MESSAGES.INVALID_FIELD_ERROR);
      } else {
        sendInternalServerErrorResponse(res, REQUEST_ERROR_MESSAGES.DB_FAILURE);
      }
      return;
    }

    ({ username, firstName, lastName } = userData);
    const { email } = userData;

    const nonSensitiveUserData = {
      email,
      username,
      firstName,
      lastName
    };
    sendSuccessResponse(res, nonSensitiveUserData);
  } else {
    sendUnexpectedMissingUserResponse(res);
    return;
  }
};

const deleteUserProfile: RequestHandler = async (req, res) => {
  const user = req.user;
  if (!user) {
    sendUnexpectedMissingUserResponse(res);
    return;
  }

  if (user.uuid != req.body.uuid) {
    sendForbiddenErrorResponse(res, 'Forbidden');
    return;
  }

  const userData = await User.findByPk(user.uuid);
  if (userData) {
    await userData.destroy();
    sendSuccessResponse(res, 'User account has been deleted');
  } else {
    sendUnexpectedMissingUserResponse(res);
    return;
  }
};

export {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
};
