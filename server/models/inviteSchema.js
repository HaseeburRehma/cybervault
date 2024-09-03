// models/inviteSchema.js

import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1d', // Token expires in 1 day
  }
});

const Invite = mongoose.model('Invite', inviteSchema);

export default Invite;
