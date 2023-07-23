import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    numOfRestrooms: {
        type: Number,
        required: true
    },
    ownerID: {
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    description: {
        type: String
    },
    averageRating: {
        type: Number,
        required: true
    }
});

export default mongoose.model("Building", buildingSchema);
