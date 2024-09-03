import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field to calculate total number of members in the team
teamSchema.virtual('totalMembers').get(function() {
  return this.members.length;
});

const Team = mongoose.model('Team', teamSchema);
export default Team;
