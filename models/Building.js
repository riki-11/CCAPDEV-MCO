import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    // single-word building code for identification in code and css.
    // example: Henry Sy -> henry, Br. Andrew Gonzalez -> andrew
    code: {
        type: String,
        required: true,
        unique: true
    },
    numOfRestrooms: {
        type: Number,
        required: true
    },
    numOfFloors: {
        type: Number,
        required: true
    },
    ownerID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String
    },
    averageRating: {
        type: Number,
        required: true
    },
    photo: {
        type: String
    }
});

export default mongoose.model("Building", buildingSchema);
