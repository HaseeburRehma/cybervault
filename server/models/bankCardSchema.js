import mongoose from 'mongoose';

const bankCardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'BankCardFolder', required: true },
    nameOnCard: { type: String, required: true },
    type: { type: String, required: true },
    number: { type: String, required: true },
    securityCode: { type: String, required: true },
    startDate: { type: Date, required: true },
    expirationDate: { type: Date, required: true },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model('BankCard', bankCardSchema);
