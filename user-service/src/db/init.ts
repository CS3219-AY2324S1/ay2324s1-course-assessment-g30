import { Sequelize } from 'sequelize';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { UserRole } from '../types/roles';
import crypto from 'crypto';

const DB_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_ADDR}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const sequelizeConnection = new Sequelize(DB_URL);

const sync = async () => {
  if (process.env.NODE_ENV == 'development') {
    await User.sync({ force: process.env.NODE_ENV == 'development' });
    console.log('The table for the User model was just (re)created!');
  } else {
    await User.sync();
  }
};

// Create admin account if not created already
const createAdminAccount = async () => {
  const adminEmail = 'admin@test.com';
  const adminAccountExist = (await User.getUserByEmail(adminEmail)) !== null;
  if (adminAccountExist) {
    return;
  }
  const hashedPassword = await hashPassword(
    process.env.ADMIN_PASSWORD as string
  );
  await User.create({
    uuid: crypto.randomUUID(),
    role: UserRole.maintainer,
    username: 'admin',
    firstName: 'admin',
    lastName: 'admin',
    hashedPassword,
    email: adminEmail
  });
  console.log('Created admin account');
};

// Initalises user model
const initalize = async () => {
  try {
    await sequelizeConnection.authenticate();
    console.log('Connection has been established successfully.');
    console.log(`Connected to ${DB_URL}`);
    await sync();
    await createAdminAccount();
  } catch (error) {
    throw new Error('Unable to connect to the database:' + error);
  }
};

export { sequelizeConnection, initalize };
