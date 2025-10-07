import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn('JWT secrets not set in env — make sure JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are provided for production');
}

export const jwtUtil = {
  signAccess(payload: object) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret', { expiresIn: ACCESS_TTL });
  },
  signRefresh(payload: object) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret', { expiresIn: REFRESH_TTL });
  },
  verifyAccess(token: string) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret');
  },
  verifyRefresh(token: string) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret');
  },
};
