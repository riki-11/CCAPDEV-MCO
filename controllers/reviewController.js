import db from '../models/mongoose.js';
import multer from 'multer';

import Review from '../models/Review.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });



const reviewController = {
    addReview: async function(req, res) {
      //console.log(req.body.restroomId);
      const photoData = req.file;

      // Extract form data from req.body
      const { rate, 'form-chkbx': amenities, 'form-date': date, 'form-review-title': title, 'form-review': content} = req.body;

      // Convert the rate from string to a number
      const rating = parseInt(rate);

      // Convert the amenities from a string or an array of strings
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];


      const dateCreated = date.toString();
      let newReview;
      // Create a new Review document based on the Review schema
      if (photoData == undefined){
        newReview = new Review({
          rating,
          amenities: amenitiesArray,
          dateCreated,
          title,
          content,
          restroomID: req.body.restroomId,

        });

      } else {

        newReview = new Review({
            rating,
            amenities: amenitiesArray,
            dateCreated,
            title,
            content,
            restroomID: req.body.restroomId,
            photo: {
              data: photoData.buffer,
              contentType: photoData.mimetype
            },
          });
      }
          //user: req.user._id  Assuming you have user authentication and req.user contains the logged-in user's details
      

      try {
          // Save the new review to the database
          await newReview.save();

          // Redirect to a success page or send a success response
          res.redirect('http://localhost:3000/profile'); // Replace with the appropriate URL for the success page
      } catch (error) {
          console.error('Error creating review:', error);
          res.status(500).send('Server error');
      }
  },

  
  updateReview: async function(req, res) {

    const photoData = req.file;
    const reviewId = req.body.reviewId;

    // Extract form data from req.body
    const { rate, 'form-chkbx': amenities, 'form-date': date, 'form-review-title': title, 'form-review': content} = req.body;

    // Convert the rate from string to a number
    const rating = parseInt(rate);
    const dateCreated = date.toString();

    // Convert the amenities from a string or an array of strings
    const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];

    const review = await Review.findById(reviewId);
    // Update the review fields only if they are not null in the form data
    review.rating = rating || review.rating;
    review.amenities = amenitiesArray.length > 0 ? amenitiesArray : review.amenities;
    console.log(date);
    review.dateCreated = dateCreated || review.dateCreated;
    review.title = title || review.title;
    review.content = content || review.content;
    review.isEdited = true;

    // If a new photo is uploaded, update the photo data
    if (photoData) {
      review.photo = {
        data: photoData.buffer,
        contentType: photoData.mimetype,
      };
    }    

    try {
     
      // Save the updated review to the database
      await review.save();
  
      // Redirect or send a response as appropriate
      res.redirect('http://localhost:3000/profile'); 
    } catch (err) {
      // Handle errors
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }

}

export default reviewController;
