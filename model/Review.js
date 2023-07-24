import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
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
    required: true
},

  amenities: {
    type: [String],
    default: [] 
  },

  restroomID: {    
    type: Schema.Types.ObjectId,
    ref: 'Restroom',
    required: true
  },

  isClean: {
    type: Boolean,
    default: false
  }, 
  isDeleted: {
    type: Boolean,
    default: false
  }, 
  isEdited: {
    type: Boolean,
    default: false
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

export default mongoose.model("Review", reviewSchema);

