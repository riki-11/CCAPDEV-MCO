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
    password: {
        type: String,
        required: true
    }, //DELETE IN FINAL BUILD SINCE PASSPORT DEALS WITH THIS NA

    // description: {
    //     type: String, 
    //     required: false
    // },

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

userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);
