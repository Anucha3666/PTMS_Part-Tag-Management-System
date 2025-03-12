import * as jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY ?? 'SECRET_KEY';
const EXPIRES_IN = '12h';

export const generate = async (payload: object | string | Buffer) => {
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
  return token;
};

export const verify = async (token: string) => {
  try {
    const decodedData = jwt.verify(token, SECRET_KEY);
    return decodedData ?? null;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
};

export const JWTUtils = {
  generate,
  verify,
};
