import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const restroomSchema = new mongoose.Schema({
    floor: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER'],
        default: 'OTHER'
    },
    category: {
        type: String,
        enum: ['STUDENT', 'FACULTY'],
        default: 'STUDENT'
      },
    buildingID: {
        type: Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
});

export default mongoose.model("Restroom", restroomSchema);
