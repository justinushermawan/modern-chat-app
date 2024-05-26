import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'modern-chat';

export const signToken = (payload: object, expiresIn = '1h') => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};
