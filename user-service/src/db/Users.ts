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
    username: username,
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
    firstName: firstName.toLowerCase(),
    lastName: lastName.toLowerCase(),
    hashedPassword,
    email: email.toLowerCase()
  });
  await User.create({
    uuid: crypto.randomUUID(),
    role,
    username: username.toLowerCase(),
    firstName: firstName.toLowerCase(),
    lastName: lastName.toLowerCase(),
    hashedPassword,
    email: email.toLowerCase()
  });
};

const getOneAdmin = async () => {
  return await User.findOne({ where: { role: UserRole.maintainer } });
};

const getRegisteredUserByEmail  = async (email: string) => {
  return await getUser({email: email.toLowerCase()})
}

const getRegisteredUserByUsername  = async (username: string) => {
  return await getUser({username: username.toLowerCase()})
}

const getRegisteredUserByUuid  = async (uuid: string) => {
  return await getUser({ uuid })
}

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
  getRegisteredUserByEmail,
  getRegisteredUserByUsername,
  getRegisteredUserByUuid,
  getOneAdmin,
  deleteUser
};

// All commands for testing purposes
const UserDbTest = {
  getUser,
  initializeUserDatabase,
  dropUserTable,
  createAdmin,
  createUser,
  getRegisteredUserByEmail,
  getRegisteredUserByUsername,
  getRegisteredUserByUuid,
  getOneAdmin,
  deleteUser
}

export { UserDb, UserDbTest };
