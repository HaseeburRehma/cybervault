import mongoose from 'mongoose';

const { Schema } = mongoose;

const bankCardFolderSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('BankCardFolder', bankCardFolderSchema);
