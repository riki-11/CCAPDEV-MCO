import db from '../models/mongoose.js';
import multer from 'multer';

import Review from '../models/Review.js';
import buildingController from './buildingController.js';
import restroomController from './restroomController.js';

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
  },

  getReviewsByBuilding: async function(buildingName) {
    try {
      // Get the restrooms under that building
      const restrooms = await restroomController.getRestroomsByBuilding(buildingName);
      // Get all the restroom ids;
      const restroomIDs = restrooms.map(restroom => restroom._id);
      
      // Get all the reviews per restroom
      const reviewPromises = restroomIDs.map(async restroomID => {
        // .populate() swaps all the references to foreign keys with THE ACTUAL OBJECT
        const restroomReviews = await Review.find({ restroomID: restroomID })
                                            .populate({
                                              path: 'restroomID',
                                              populate: {
                                                path: 'buildingID',
                                                select: 'name',
                                              },
                                            })
                                            .populate('user')
                                            .lean();
                                    
        // For each review, add the source of the profile image and the review's image to the object 
        restroomReviews.map(review => {
          review['profImgSrc'] = review.user.photo && review.user.photo.contentType ? `data:${review.user.photo.contentType};base64,${review.user.photo.data.toString('base64')}` : null;
          review['photoSrc'] = review.photo && review.photo.contentType ? `data:${review.photo.contentType};base64,${review.photo.data.toString('base64')}` : null;
        })

        return restroomReviews;
      });

      // Save all the reviews ine one array
      const reviewArrays = await Promise.all(reviewPromises);
      const reviews = reviewArrays.reduce((acc, curr) => acc.concat(curr), []);


      return reviews;
      
    } catch (err) {
      console.error(err);
      res.status(500).send("Reviews cannot be found");
    }
  }
}

export default reviewController;
