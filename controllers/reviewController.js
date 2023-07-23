import db from '../models/mongoose.js';

import Review from '../models/Review.js';

const reviewController = {
    addReview: async function(req, res) {
      // Extract form data from req.body
      const { rate, 'form-chkbx': amenities, 'form-date': date, 'form-review-title': title, 'form-review': content } = req.body;

      // Convert the rate from string to a number
      const rating = parseInt(rate);

      // Convert the amenities from a string or an array of strings
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];

      // Create a new Review document based on the Review schema
      const newReview = new Review({
          rating,
          amenities: amenitiesArray,
          date,
          title,
          content,
          //user: req.user._id  Assuming you have user authentication and req.user contains the logged-in user's details
      });

      try {
          // Save the new review to the database
          await newReview.save();
          console.log('Review created:', newReview);

          // Redirect to a success page or send a success response
          res.redirect('http://localhost:3000/establishment'); // Replace with the appropriate URL for the success page
      } catch (error) {
          console.error('Error creating review:', error);
          res.status(500).send('Server error');
      }
  }


}

export default reviewController;
