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
  declare firstName: string;
  declare lastName: string;
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
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
