import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  dateCreated: {
    type: String,
    required: true,
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
      },
      contentType: {
        type: String,
      },
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

  cleanCount: {
    type: Number,
    default: 0
  },
  disgustingCount: {
    type: Number, 
    default: 0
  }, 
  isEdited: {
    type: Boolean,
    default: false
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  likers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }, 

  dislikers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }

});



export default mongoose.model("Review", reviewSchema);

