import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AddressFolder',
    required: true
  },
  title: { type: String, required: true },
  personName: { type: String, required: true },
  username: { type: String },
  gender: { type: String },
  birthday: { type: Date },
  company: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  timezone: { type: String },
  emailAddress: { type: String },
  phone: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
