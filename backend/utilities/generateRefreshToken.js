import UserModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
const generatedRefreshToken = async (UserId) => {
  const token = jwt.sign(
    { id: UserId },
    process.env.JWT_SECRET || 'refresh-token-secret',
    { expiresIn: '30d' }
  );

  const updateRefreshTokenUser = await UserModel.updateOne(
    {
      _id: UserId,
    },
    { refresh_token: token }
  );

  return token;
};

export default generatedRefreshToken;
