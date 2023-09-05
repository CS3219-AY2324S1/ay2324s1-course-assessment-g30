import { RequestHandler } from 'express';
import User from '../models/User';

const createUser: RequestHandler = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.json({ err: 'Missing fields', res: '' });
    return;
  }

  // Check if username exists
  let registeredUser = await User.findOne({
    where: {
      username
    }
  });
  if (registeredUser) {
    res.json({ err: 'Username is in use', res: '' });
    return;
  }

  // Check if email exists
  registeredUser = await User.findOne({
    where: {
      email
    }
  });

  if (registeredUser) {
    res.json({ err: 'Email is in use', res: '' });
    return;
  }

  const newUser = User.build({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  try {
    await newUser.save();
    res.json({ err: '', res: 'Account created successfully' });
  } catch (error) {
    res.json({ err: 'Failed to add user to database', res: '' });
  }
};

export { createUser };
