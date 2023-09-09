import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize';
import { sequelizeConnection } from '../db/init';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare uuid: string;
  declare username: string;
  declare email: string;
  declare hashedPassword: string;
}

User.init(
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { sequelize: sequelizeConnection }
);

export default User;
