import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      req.decodedToken = decodedToken;
      next();
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
