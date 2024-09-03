import express from 'express';
import mongoose from 'mongoose';
import Team from '../models/teamSchema.js';
import TeamMember from '../models/teamMemberSchema.js';
import User from '../models/userSchema.js';
import Invite from '../models/inviteSchema.js'; // Import the Invite model
import { verifyToken } from '../middleware/authMiddleware.js'; // Import the token verification middleware
import crypto from 'crypto';
import nodemailer from 'nodemailer';
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

const sendInvitationEmail = async (email, teamId) => {
  try {
    // Fetch the team and admin details
    const team = await Team.findById(teamId).populate('admin');
    if (!team) {
      throw new Error('Team not found');
    }

    const adminName = team.admin.name; // Assuming the admin has a 'name' field
    const teamName = team.name;
    const userStatus = 'Team Member'; // As specified in your request
    const token = crypto.randomBytes(20).toString('hex');
    const url = `${process.env.BASE_URL}/api/auth/invite-registration?token=${token}&teamId=${teamId}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Team Invitation to Join ' + teamName,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #555;">You've been invited to join the team <strong>${teamName}</strong>!</h2>
          <p>Hi,</p>
          <p>You have been invited to join the team <strong>${teamName}</strong> by <strong>${adminName}</strong>. Your role in the team will be: <strong>${userStatus}</strong>.</p>
          <p>Please click the button below to register and join the team:</p>
          <a href="${url}" style="display: inline-block; padding: 10px 20px; margin-top: 10px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Join Team</a>
          <p>Or copy and paste the following link into your browser:</p>
          <p><a href="${url}">${url}</a></p>
          <hr>
          <p style="font-size: 12px; color: #777;">Token: ${token}</p>
          <p style="font-size: 12px; color: #777;">Team ID: ${teamId}</p>
          <p style="font-size: 12px; color: #777;">If you did not expect this invitation, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Save the invitation token to the database
    await Invite.create({ token, teamId, email });
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
};


// Route to send an invitation
router.post('/invite-member', verifyToken, async (req, res) => {
  try {
    const { email, teamId } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Send the invitation email
    await sendInvitationEmail(email, teamId);

    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to check if the user is an admin of the team
const checkAdmin = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const userId = req.decodedToken.id; // Assuming user ID is available in the token

    const team = await Team.findById(teamId).populate('admin');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.admin._id.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not an admin' });
    }

    next();
  } catch (error) {
    console.error('Error checking admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get the allowed member count based on the plan
const getAllowedMembersCount = (plan) => {
  switch (plan) {
    case 'Platinum':
      return 3;
    case 'Premium':
      return 5;
    default:
      return 0; // For other plans or free, no members allowed
  }
};

// Create a new team
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const adminId = req.decodedToken.id; // Assuming user ID is available in the token

    // Check if the team name already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name already exists' });
    }

    // Create a new team
    const team = new Team({ name, admin: adminId });
    await team.save();

    res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a user to a team
router.post('/:teamId/add-member', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const team = await Team.findById(teamId).populate('admin');

    // Check if the user is already a member
    const existingMember = await TeamMember.findOne({ user: userId, team: teamId });
    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Check if adding the user exceeds the allowed member count
    const allowedMembersCount = getAllowedMembersCount(team.admin.plan);
    if (team.members.length >= allowedMembersCount) {
      return res.status(403).json({ message: `Cannot add more members. Allowed: ${allowedMembersCount}` });
    }

    // Add the user to the team
    const teamMember = new TeamMember({ user: userId, team: teamId });
    await teamMember.save();

    // Add the team member reference to the team
    await Team.findByIdAndUpdate(teamId, { $push: { members: teamMember._id } });

    // Update the user's plan status to 'team member'
    user.plan = 'team member';
    await user.save();

    res.status(200).json({ message: 'Member added successfully', teamMember });
  } catch (error) {
    console.error('Error adding member to team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove a user from a team
router.delete('/:teamId/remove-member/:memberId', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { teamId, memberId } = req.params;

    // Remove the team member
    const teamMember = await TeamMember.findByIdAndDelete(memberId);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Remove the team member reference from the team
    await Team.findByIdAndUpdate(teamId, { $pull: { members: memberId } });

    // Update the user's plan status back to 'Free'
    const user = await User.findById(teamMember.user);
    if (user) {
      user.plan = 'Free';
      await user.save();
    }

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member from team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get team details
router.get('/:teamId', verifyToken, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).populate('admin').populate('members');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({ team });
  } catch (error) {
    console.error('Error fetching team details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update team details (e.g., name)
router.put('/:teamId/update', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name } = req.body;

    // Update the team name
    const updatedTeam = await Team.findByIdAndUpdate(teamId, { name }, { new: true });
    if (!updatedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({ message: 'Team updated successfully', updatedTeam });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all teams
router.get('/', verifyToken, async (req, res) => {
  try {
    const teams = await Team.find().populate('admin').populate('members');
    res.status(200).json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
