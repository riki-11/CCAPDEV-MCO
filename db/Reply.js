import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const replySchema = new mongoose.Schema({
    reviewID: {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    ownerID: {
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    reply: {
        type: String,
        required: true
    },
    replyDate: {
        type: Date,
        default: Date.now
    },
    photo: {
        type: Buffer
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
});

export default mongoose.model("Reply", replySchema);
