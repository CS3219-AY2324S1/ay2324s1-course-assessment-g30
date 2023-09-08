import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize';
import { sequelizeConnection } from '../db/init';

type UserAttributes = {
  username: string;
  email: string;
  hashedPassword: string;
  salt: string;
};

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare username: string;
  declare email: string;
  declare hashedPassword: string;
  declare salt: string;
}

User.init(
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
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { sequelize: sequelizeConnection }
);

export default User;