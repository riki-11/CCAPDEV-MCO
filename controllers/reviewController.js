import db from '../models/mongoose.js';
import multer from 'multer';

import Review from '../models/Review.js';

import Restroom from '../models/Restroom.js';
import Building from '../models/Building.js';
import buildingController from './buildingController.js';

import restroomController from './restroomController.js';
import Reply from '../models/Reply.js';

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

      // Get user from database
      // const user = await User.findOne({'username': req.session.username}).exec();

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
          user: req.user
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
            user: req.user//Mongoose.contentTypereq.session.username
          });
      }
          //user: req.user._id  Assuming you have user authentication and req.user contains the logged-in user's details
      

      try {
          // Save the new review to the database
          await newReview.save();

          // Redirect to a success page or send a success response
          res.redirect('/profile'); // Replace with the appropriate URL for the success page
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
      res.redirect('/profile'); 
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

      // Save all the reviews in one array
      const reviewArrays = await Promise.all(reviewPromises);
      const reviews = reviewArrays.reduce((acc, curr) => acc.concat(curr), []);


      return reviews;
      
    } catch (err) {
      console.error(err);
      res.status(500).send("Reviews cannot be found");
    }
  },
      
  getReviewsCountForBuilding: async function(buildingName) {
    try {
      const reviews = await reviewController.getReviewsByBuilding(buildingName);
      return reviews.length;
    } catch (err) {
      console.error(err);
      throw new Error("Reviews cannot be found");
    }
  },
  
  addReply: async function(req, res) {
    try {
      const user = req.user;
      const replyData = req.body;

      console.log(`CURRENT USER: ${user}`);
      console.log(`REPLIED TO: ${replyData.reviewID}`);
      console.log(`REPLY TEXT: ${replyData.reply}`);

      // With all the data create a new reply.
      var newReply = new Reply({
        reviewID: replyData.reviewID,
        ownerID: user.id,
        reply: replyData.reply,
        replyDate: replyData.replyDate
      });

      // Save the new reply to the database
      await newReply.save();

      const bldg = await Building.findOne({ 'ownerID' : user._id }).lean();
      res.redirect(`/establishment?building=${bldg.name}`);

    } catch (err) {
      console.error(err);
      res.status(500).send("Cannot add reply");
    }
  },

  // Gets all the replies for a specific review
  getAllReplies: async function(req, res) {
    try {
      // Grab the reviewID from the url parameter
      const reviewID = req.query.reviewID;
      // Get all the replies for that review
      const replies = await Reply.find({reviewID: reviewID})
                            .populate('ownerID')
                            .lean();
      
      // Wait for the promise to be fulfilled before moving on
      await Promise.all(replies);

      // Return the list of replies to the controller to load it into the DOM
      if (replies) {
        res.json(replies);
      } else {
        res.status(500).send("Replies not found.");
      }

    } catch (err) {
      console.error(err);
      res.status(500).send("Replies not found.");
    }
  },
    
  sortReviews: async function(reviews, sortBy) {
    switch (sortBy) {
      case 'rating_asc':
        return reviews.sort((a, b) => a.rating - b.rating);
      case 'rating_desc':
        return reviews.sort((a, b) => b.rating - a.rating);
      default:
        return reviews;
    }
  },
    
  searchReviews: async function(searchQuery, buildingID) {
    try {
      const regexQuery = new RegExp(searchQuery, 'i');
      const reviews = await Review.find({
        $and: [
          {
            $or: [
              { title: regexQuery },
              { content: regexQuery },
          
            ],
          },
        ],
      }).lean();

      let filteredReviews = [];
      console.log(reviews.length);
      for (const review of reviews) {
        let restroom = await Restroom.findById(review.restroomID);
        console.log(restroom);
        let revBuilding = restroom.buildingID;
        let building = await Building.findById(revBuilding);
        let actBuildingID = building._id;
        console.log(actBuildingID);
        console.log(buildingID);
        console.log(actBuildingID.toString() == buildingID.toString());


        if (actBuildingID.toString() == buildingID.toString()) {
          filteredReviews.push(review);
        }
      }
      console.log(filteredReviews.length);
      return filteredReviews;
    } catch (error) {
      console.error('Error fetching buildings:', error);
      res.status(500).send('Server error');
    }
  },
}

export default reviewController;
