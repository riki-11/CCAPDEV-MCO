import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const restroomSchema = new mongoose.Schema({
    floor: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE'],
        default: 'MALE'
    },
    category: {
        type: String,
        enum: ['STUDENT'],
        default: 'STUDENT'
      },
    buildingID: {
        type: Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
});

restroomSchema.index({ floor: 1, gender: 1, category: 1, buildingID: 1 }, { unique: true });


export default mongoose.model("Restroom", restroomSchema);
