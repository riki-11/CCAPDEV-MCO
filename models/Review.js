import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  dateCreated: {
    type: String,
    // Set the default value to the current date
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
    //default: '64bd2ba04e2c41c0fa918e4f'
    //required: true

  }

});



export default mongoose.model("Review", reviewSchema);

