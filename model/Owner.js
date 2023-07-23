import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

export default mongoose.model("Owner", ownerSchema);
