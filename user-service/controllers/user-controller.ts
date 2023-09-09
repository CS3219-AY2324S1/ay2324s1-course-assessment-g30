import { RequestHandler } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import {
  BAD_REQUEST_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  SALT_ROUNDS
} from '../constants';
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';

const createUser: RequestHandler = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res
      .status(BAD_REQUEST_STATUS_CODE)
      .json({ err: 'Missing fields', res: '' });
    return;
  }

  // Check if username exists
  let registeredUser = await User.findOne({
    where: {
      username
    }
  });
  if (registeredUser) {
    res
      .status(BAD_REQUEST_STATUS_CODE)
      .json({ err: 'Username is in use', res: '' });
    return;
  }

  // Check if email exists
  registeredUser = await User.findOne({
    where: {
      email
    }
  });

  if (registeredUser) {
    res
      .status(BAD_REQUEST_STATUS_CODE)
      .json({ err: 'Email is in use', res: '' });
    return;
  }

  let hashedPassword;
  let salt;

  try {
    salt = await bcrypt.genSalt(SALT_ROUNDS);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({ err: '', res: '' });
    return;
  }

  const newUser = User.build({
    uuid: crypto.randomUUID(),
    username: req.body.username,
    hashedPassword,
    email: req.body.email
  });

  try {
    await newUser.save();
    res.json({ err: '', res: 'Account created successfully' });
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .json({ err: 'Failed to add user to database', res: '' });
  }
};

const loginUser: RequestHandler = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    res
      .status(BAD_REQUEST_STATUS_CODE)
      .json({ err: 'Missing fields', res: '' });
    return;
  }

  // Fetch username, and hash password
  const registeredUser = await User.findOne({
    where: {
      email
    }
  });

  if (!registeredUser) {
    res
      .status(FORBIDDEN_STATUS_CODE)
      .json({ err: 'User does not exist', res: '' });
    return;
  }
  const hasCorrectPassword = await bcrypt.compare(
    password,
    registeredUser.hashedPassword
  );

  if (!hasCorrectPassword) {
    res
      .status(FORBIDDEN_STATUS_CODE)
      .json({ err: 'Incorrect password for user account', res: '' });
    return;
  }

  const accessToken = jsonwebtoken.sign(
    { uuid: registeredUser.uuid },
    process.env.JWT_SECRET as string,
    { expiresIn: '7 days' }
  );
  res.json({ err: '', res: { accessToken: accessToken } });
};

export { createUser, loginUser };
