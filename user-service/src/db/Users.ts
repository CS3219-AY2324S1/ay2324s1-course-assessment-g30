import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { UserRole } from '../types/roles';
import crypto from 'crypto';

const initializeUserDatabase = async () => {
  await User.sync();
  console.log('Synced');
};

const createAdmin = async (
  username: string,
  firstName: string,
  lastName: string,
  password: string,
  email: string
) => {
  await createAccount(
    UserRole.maintainer,
    username,
    firstName,
    lastName,
    password,
    email
  );
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
  await createAccount(
    UserRole.registeredUser,
    username,
    firstName,
    lastName,
    password,
    email
  );
};

const createAccount = async (
  role: UserRole,
  username: string,
  firstName: string,
  lastName: string,
  password: string,
  email: string
) => {
  const hashedPassword = await hashPassword(password);
  console.log({
    uuid: crypto.randomUUID(),
    role,
    username: username.toLowerCase(),
    firstName,
    lastName,
    hashedPassword,
    email
  });
  await User.create({
    uuid: crypto.randomUUID(),
    role,
    username: username.toLowerCase(),
    firstName,
    lastName,
    hashedPassword,
    email
  });
};

const getOneAdmin = async () => {
  return await User.findOne({ where: { role: UserRole.maintainer } });
};

const getUser = async (filterCriteria: any) => {
  return await User.findOne({ where: filterCriteria });
};

const deleteUser = async (uuid: string) => {
  await User.destroy({
    where: {
      uuid
    }
  });
};

const dropUserTable = async () => {
  await User.drop();
};

const UserDb = {
  initializeUserDatabase,
  dropUserTable,
  createAdmin,
  createUser,
  getUser,
  getOneAdmin,
  deleteUser
};

export { UserDb };
