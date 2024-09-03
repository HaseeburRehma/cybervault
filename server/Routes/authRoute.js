import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/userSchema.js';
import TeamMember from '../models/teamMemberSchema.js';
import Team from '../models/teamSchema.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendVerificationEmail = async (user, token) => {
  const url = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
  };

  await transporter.sendMail(mailOptions);
};

// Sign-up API
// router.post('/signup', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     let role = 'user';
//     if (email.endsWith('@adminemail.com')) {
//       role = 'admin';
//     }

//     user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role
//     });
//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     await sendVerificationEmail(user, token);

//     console.log(`User ${username} registered successfully. Verification email sent to ${email}.`);

//     res.status(200).json({ msg: 'User registered successfully. Please check your email to verify your account.' });
//   } catch (err) {
//     console.error('Error in signup:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// In your signup API

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, token, teamId } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine user role
    let role = 'user';
    if (email.endsWith('@adminemail.com')) {
      role = 'admin';
    }

    // Create the new user
    user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isVerified: false // Set user as not verified initially
    });
    await user.save();

    // Generate an email verification token
    const emailToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send verification email
    await sendVerificationEmail(user, emailToken);

    // Check if there's a pending invitation
    if (token && teamId) {
      // Create or update the team member status
      const teamMember = await TeamMember.findOneAndUpdate(
        { user: user._id, team: teamId },
        { status: 'active' },
        { new: true, upsert: true } // If not found, create a new entry
      );

      if (!teamMember) {
        return res.status(500).json({ msg: 'Failed to add user to the team member collection.' });
      }

      // Update the team's members array
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }

      if (!team.members.includes(user._id)) {
        team.members.push(teamMember._id);
        await team.save();
      }

      // Also, update the user's plan to 'team member'
      user.plan = 'team member';
      await user.save();
    }

    res.status(200).json({
      msg: 'User registered successfully. Please check your email to verify your account.'
    });

    console.log(`User ${user.username} registered successfully. Verification email sent to ${user.email}.`);
  } catch (err) {
    console.error('Error in signup:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});




// Email verification API
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    user.isVerified = true;
    await user.save();

    res.redirect('http://localhost:3000/credentialform'); // Redirect to login page after verification
  } catch (err) {
    console.error('Error in email verification:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Log-in API
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email first' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10y' });
    res.status(200).json({ token, userId: user._id });

    console.log(`User ${user.username} logged in successfully.`);
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Forgot password API
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Email not found' });
    }

    const newPassword = crypto.randomBytes(8).toString('hex');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'New Password',
      html: `<p>Your new password is: ${newPassword}</p>`
    };

    await transporter.sendMail(mailOptions);

    console.log(`New password sent to ${email}.`);

    res.status(200).json({ msg: 'New password sent to your email.' });
  } catch (err) {
    console.error('Error in forgot password:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Change password API
router.post('/change-password', async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Old password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    console.log(`User ${user.username} changed password successfully.`);

    res.status(200).json({ msg: 'Password changed successfully.' });
  } catch (err) {
    console.error('Error in change password:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
