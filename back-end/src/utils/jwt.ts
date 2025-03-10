import jwt from 'jsonwebtoken';

const JWT = () => {
  const secretKey = process.env.SECRET_KEY ?? '';

  const generate = async (
    payload:
      | {
          name: string;
          username: string;
          role: string;
          email: string;
          gen: Date;
          ext: Date;
        }
      | string
      | object
      | Buffer,
  ) => {
    const token = await jwt?.sign(payload, secretKey, { expiresIn: '1h' });
    return token ?? null;
  };

  const decode = async (token: string) => {
    try {
      const decodedData = await jwt?.verify(token, secretKey);
      return decodedData ?? null;
    } catch {
      console.error('Invalid token');
      return null;
    }
  };

  return {
    generate,
    decode,
  };
};

export default JWT;
