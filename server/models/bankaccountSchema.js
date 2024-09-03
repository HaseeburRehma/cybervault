import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema({
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccountFolder',
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    routingNumber: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    swiftCode: {
        type: String,
        required: true
    },
    ibanNumber: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    },
    branchAddress: {
        type: String,
        required: true
    },
    branchPhone: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('BankAccount', bankAccountSchema);
