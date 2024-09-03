import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Middleware to verify JWT and extract user info
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check if the user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};

// Get user details (accessible by the user themselves)
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all users (accessible by admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching all users:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch user ID by email
router.get('/userByEmail', authMiddleware, async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ msg: 'Email parameter is required' });
  }

  try {
    const user = await User.findOne({ email }).select('_id');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ userId: user._id });
  } catch (err) {
    console.error('Error fetching user by email:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add this route to your existing routes
router.get('/user/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



export default router;
