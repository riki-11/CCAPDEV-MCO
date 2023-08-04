import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type:String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    description: {
        type: String
    },

    isOwner: {
        type: Boolean,
        default: false
    },

    photo: {
        data: {
            type: Buffer,
          },
          contentType: {
            type: String,
          },
    }
});

export default mongoose.model("User", userSchema);
