import db from '../models/mongoose.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Review from '../models/Review.js';


import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });


/*
    defines an object which contains functions executed as callback
    when a client requests for `profile` paths in the server
*/
const userController = {


    viewProfile: async function (req, res) {
        try {
          // Assuming you have the user ID from the session or request
          const userId = '64bd2ba04e2c41c0fa918e4f'; // Replace with the actual user ID
    
          // Fetch the user's data from the database
          const user = await User.findById(userId);
    
          // Render the template and pass the user's data
          res.render('profile', { user });
        } catch (error) {
          console.error('Error fetching user data:', error);
          res.status(500).send('Server error');
        }
      },

    /*
        executed when the client sends an HTTP GET request `/profile/:idNum`
        as defined in `../routes/routes.js`
    */
    updateUser: async function(req, res) {
        // get user ID, find it in database, then update the database

        const photoData = req.file;

        const { firstname, lastname, username, email, password } = req.body;
        const sampleUserID = new mongoose.Types.ObjectId('64bd2ba04e2c41c0fa918e4f'); 

        try {
            const updatedUser = await User.findById(sampleUserID); //userID should be obtained from session
            if (!updatedUser) {
                return res.status(404).send('User not found');
            }

            console.log(lastname);

            updatedUser.firstName = firstname;
            updatedUser.lastName = lastname;
            updatedUser.username = username;
            updatedUser.email = email;
            updatedUser.password = password;
            updatedUser.photo = {
                data: photoData.buffer,
                contentType: photoData.mimetype,
              };
            await updatedUser.save();
            console.log(updatedUser);

            console.log('User updated')
            res.redirect('http://localhost:3000/profile');
        } catch (e) {
            console.error('Error updating user ', e);
            res.redirect('http://localhost:3000/edit-profile');
        }

    },

    
    addUser: async function (req, res) {
        const { firstname, lastname, username, email, password } = req.body; // Extract the form data

        try {
            // Create a new user document based on the User schema
            const newUser = new User({
                 firstName: firstname,
                 lastName: lastname,
                 username: username,
                 email: email,
                 password: password,
             });

            // Save the new user to the database
            await newUser.save();
            console.log(newUser);

            // Redirect to a success page or send a success response
            res.redirect('http://localhost:3000/profile'); // Replace with the appropriate URL for the success page
        
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Server error');
        }
    },

    getReviewsByUserID: async function (req, res) {
        const userID = '64bd2ba04e2c41c0fa918e4f'; // Replace with the actual userID
    
        try {
            const reviews = await Review.find({ user: new mongoose.Types.ObjectId(userID) }).lean();          
            return reviews;
        } catch (error) {
          console.error('Error fetching reviews:', error);
          res.status(500).send('Server error');
        }
      },

}

export default userController;
