import 'dotenv/config';
import { Sequelize } from 'sequelize';
import User from '../models/User';

const sequelizeConnection = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_ADDR}:${process.env.DB_PORT}/${process.env.DB_NAME}`
);

const sync = async () => {
  await User.sync({ force: process.env.NODE_ENV == 'development' });
  console.log('The table for the User model was just (re)created!');
};

// Initalises user model
const initalize = async () => {
  try {
    await sequelizeConnection.authenticate();
    console.log('Connection has been established successfully.');
    await sync();
  } catch (error) {
    return new Error('Unable to connect to the database:' + error);
  }
};

export { sequelizeConnection, initalize };
