import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize';
import { sequelizeConnection } from '../db/init';
import { UserRole } from 'types/roles';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare uuid: string;
  declare role: UserRole;
  declare username: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare hashedPassword: string;
  static getUserByEmail: (email: string) => Promise<User | null>;
}

User.getUserByEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });

  return user;
};

User.init(
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
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
