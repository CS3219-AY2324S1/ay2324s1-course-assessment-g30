import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constants';

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export { hashPassword };
