import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { UserRole } from '../types/roles';
import crypto from 'crypto';

const initializeUserDatabase = async () => {
  await User.sync();
  console.log('Synced');
};

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

const createUser = async (
  username: string,
  firstName: string,
  lastName: string,
  password: string,
  email: string
) => {
  const hashedPassword = await hashPassword(password);
  console.log({
    uuid: crypto.randomUUID(),
    role: UserRole.registeredUser,
    username: username.toLowerCase(),
    firstName,
    lastName,
    hashedPassword,
    email
  });
  await User.create({
    uuid: crypto.randomUUID(),
    role: UserRole.registeredUser,
    username: username.toLowerCase(),
    firstName,
    lastName,
    hashedPassword,
    email
  });
};

const dropUserTable = async () => {
  await User.drop();
};

const UserDb = {
  initializeUserDatabase,
  createAdminAccount,
  dropUserTable,
  createUser
};

export { UserDb };
