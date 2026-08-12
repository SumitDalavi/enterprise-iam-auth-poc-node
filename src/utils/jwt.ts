import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'enterprise-secret-key-node';
const EXPIRES_IN = '1h';

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  roles: string[];
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET_KEY) as JwtPayload;
};
