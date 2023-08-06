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
        ref: 'User',
        required: true
    },
    reply: {
        type: String,
        required: true
    },
    replyDate: {
        type: String,
        required: true
    },

});

export default mongoose.model("Reply", replySchema);
