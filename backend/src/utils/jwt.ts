import jwt from 'jsonwebtoken';
import config from '../config';
import { User } from '../types';

export interface JWTPayload {
  userId: string;
  tenantId?: string;
  email: string;
  role: string;
}

export const generateAccessToken = (user: User): string => {
  const payload: JWTPayload = {
    userId: user.id,
    tenantId: user.tenant_id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (user: User): string => {
  const payload: JWTPayload = {
    userId: user.id,
    tenantId: user.tenant_id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpire,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
};
