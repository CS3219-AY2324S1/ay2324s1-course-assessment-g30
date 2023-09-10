import { JwtPayload } from 'jsonwebtoken';

export interface JwtToken extends JwtPayload {
  email: string;
}
