import mongoose from 'mongoose';

// For session management
import passportLocalMongoose from 'passport-local-mongoose';

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
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    description: {
        type: String,
        default: ""
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

userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);
