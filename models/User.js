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
    // passport-local-mongoose makes it so that passwords are not stored locally, 
    // and user documents would instead have hashes and salts.
    /*
        password: {
            type: String,
            required: true
        },
    */
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

userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);
