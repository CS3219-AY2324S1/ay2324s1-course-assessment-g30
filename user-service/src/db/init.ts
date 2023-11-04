import { Sequelize } from 'sequelize';
import User from '../models/User';
import { UserDb } from './Users';

let DB_URL = '';
if (process.env.NODE_ENV == 'test') {
  DB_URL = `postgres://${process.env.TEST_DB_USER}:${process.env.TEST_POSTGRES_PASSWORD}@${process.env.TEST_DB_ADDR}:${process.env.TEST_DB_PORT}/test`;
} else {
  DB_URL = `postgres://${process.env.DB_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_ADDR}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
}
const sequelizeConnection = new Sequelize(DB_URL);

const sync = async () => {
  if (process.env.NODE_ENV == 'development') {
    await User.sync({ force: process.env.NODE_ENV == 'development' });
    console.log('The table for the User model was just (re)created!');
  } else {
    await User.sync();
  }
};

const seedAdmin = async () => {
  const adminEmail = 'admin@test.com';
  const password = process.env.ADMIN_PASSWORD as string;
  const adminAccountExist = (await User.getUserByEmail(adminEmail)) !== null;

  if (adminAccountExist) {
    return;
  }
  await UserDb.createAdmin('admin', 'admin', 'admin', password, adminEmail);
};

// Initalises user model
const initalize = async () => {
  try {
    await sequelizeConnection.authenticate();
    console.log('Connection has been established successfully.');
    console.log(`Connected to ${DB_URL}`);
    await sync();
    await seedAdmin();
  } catch (error) {
    console.log('Unable to connect to the database:' + error);
    process.exit(1);
  }
};

export { sequelizeConnection, initalize };
