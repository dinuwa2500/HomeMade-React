import jwt from 'jsonwebtoken';

const generatedAccessToken = (userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'access-token-secret',
    { expiresIn: '5h' }
  );
  return token;
};

export default generatedAccessToken;
