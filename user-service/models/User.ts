import { DataTypes, Model } from 'sequelize';
import { sequelizeConnection } from '../db/init';

type UserAttributes = {
  username: string;
  email: string;
  password: string;
};

const User = sequelizeConnection.define<Model<UserAttributes, UserAttributes>>(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {}
);

export default User;
