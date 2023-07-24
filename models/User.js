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
    photo: {
        data: {
            type: Buffer,
            default: Buffer.from([]), 
          },
          contentType: {
            type: String,
            default: 'image/jpeg', 
          },
    }
});

export default mongoose.model("User", userSchema);
