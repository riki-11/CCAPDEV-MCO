import db from '../models/mongoose.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Review from '../models/Review.js';

// For session management
import passport from 'passport'; 

// For image processing
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
        // const userId = '64bd2ba04e2c41c0fa918e4f'; // Replace with the actual user ID
        // User.find({'username': req.session.username}).exec();

          // Fetch the user's data from the database
          //const user = await User.findById(userId);
          const user = await User.findbyId(req.user._id).exec();
          
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
        // const sampleUserID = new mongoose.Types.ObjectId('64bd2ba04e2c41c0fa918e4f'); 

        try {
            const updatedUser = req.user; //userID should be obtained from session
            if (!updatedUser) {
                return res.status(404).send('User not found');
            }

            if (photoData) {

                updatedUser.firstName = firstname;
                updatedUser.lastName = lastname;
                updatedUser.username = username;
                updatedUser.email = email;
                updatedUser.password = password;
                updatedUser.photo = {
                    data: photoData.buffer,
                    contentType: photoData.mimetype,
                  };
            } else {
                updatedUser.firstName = firstname;
                updatedUser.lastName = lastname;
                updatedUser.username = username;
                updatedUser.email = email;
                updatedUser.password = password;
            }
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
                 password: password // REMOVE IN FINAL BUILD BECAUSE OF PASSPORT
             });

            // Save the new user to the database using passport-local-mongoose
            User.register(newUser, password, (err, user) => {
                if (err) {
                    console.error('Error registering user:', err);
                    return res.redirect('/register'); // Redirect back to registration page on error
                }

                passport.authenticate('local')(req, res, () => {
                    res.redirect('/'); // Redirect to dashboard or any other page on successful registration
                });
            })
            // await newUser.save();
            console.log(newUser);
            
            // Redirect to a success page or send a success response
            // res.redirect('http://localhost:3000/profile'); // Replace with the appropriate URL for the success page
        
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Server error');
        }
    },

    getReviewsByUserID: async function (req, res) {
        const userID = '64bd2ba04e2c41c0fa918e4f'; // Replace with the actual userID
        
        try {
            // const reviews = await Review.find({ user: new mongoose.Types.ObjectId(userID) }).lean();          
            const reviews = await Review.findbyId(req.session._id).lean();
            return reviews;
        } catch (error) {
          console.error('Error fetching reviews:', error);
          res.status(500).send('Server error');
        }
      },

    loginUser: function(req, res) {
        req.session.username = req.user.username;
        //console.log(req.user)
        res.redirect('/');
    },

    verifyLogin: function (req, res, next) { // Used to verify if the user is logged in to access pages
        if (req.isAuthenticated()) {
          return next();
        }
        res.redirect('/login'); // Redirect to login page if user is not authenticated
      }

}

export default userController;
