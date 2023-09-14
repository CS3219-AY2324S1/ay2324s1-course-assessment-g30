import { Sequelize } from 'sequelize';
import User from '../models/User';

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

// Initalises user model
const initalize = async () => {
  try {
    await sequelizeConnection.authenticate();
    console.log('Connection has been established successfully.');
    console.log(`Connected to ${DB_URL}`);
    await sync();
  } catch (error) {
    return new Error('Unable to connect to the database:' + error);
  }
};

export { sequelizeConnection, initalize };
