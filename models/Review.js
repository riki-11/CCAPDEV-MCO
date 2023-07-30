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
    data: Buffer, 
    contentType: String 
  },
  amenities: {
    type: [String],
    default: [] 
  },

  restroomID: {    
    type: Schema.Types.ObjectId,
    ref: 'Restroom',
    //required: true
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
    default: '64bd2ba04e2c41c0fa918e4f'
    //required: true

  }

});

export default mongoose.model("Review", reviewSchema);

