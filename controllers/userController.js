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

    // Function to check if the email is already registered
    checkEmailAvailability: async function(email) {
        try {
            const user = await User.findOne({ email: email });
            return !!user; // Returns true if a user with the email exists, false otherwise
        } catch (err) {
        console.error('Error while checking email availability:', err);
        return false;
        }
    },

    formValidation: async function (password, username, email) {
        const isUsernameTaken = await userController.checkUsernameAvailability(username);
        const isEmailTaken = await userController.checkEmailAvailability(email);

        if (isUsernameTaken) {
            return "Username is already taken.";
        }

        if (isEmailTaken) {
            return "Email is already taken.";
        }
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }

        // Check if the email is in a valid format using regular expression
        const emailFormatRegex = /\S+@\S+\.\S+/;
        if (!emailFormatRegex.test(email)) {
            return "Invalid email format.";
        }


        // Check if the username or email is already in use in the database

        return true;
        
    },
     /*
        executed when the client sends an HTTP GET request `/profile/:idNum`
        as defined in `../routes/routes.js`
    */
    updateUser: async function(req, res) {
        // get user ID, find it in database, then update the database


        const photoData = req.file;

        const { firstname, lastname, username, email, password, description } = req.body;
        // const sampleUserID = new mongoose.Types.ObjectId('64bd2ba04e2c41c0fa918e4f'); 

        try {
            
            const updatedUser = req.user; //userID should be obtained from session
            if (!updatedUser) {
                return res.status(404).send('User not found');
            }
            const response = await userController.formValidation(password, username, email);
            

            if (response == true) {

                if (photoData) {
    
                    updatedUser.firstName = firstname;
                    updatedUser.lastName = lastname;
                    updatedUser.username = username;
                    updatedUser.email = email;
                    updatedUser.password = password;
                    updatedUser.description = description;
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
                    updatedUser.description = description;
                }
            
            // (IN FINAL BUILD) If they have a value inputted for password, it sets it to reflect to the db
            if (password) {
                await updatedUser.setPassword(password);
            }
            
                await updatedUser.save();
                console.log(updatedUser);
    
                console.log('User updated')
                res.redirect('/profile');
            } else {
                const user = updatedUser;
                const userinfo = {
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    username: req.user.username,
                    email: req.user.email,
                    password: req.user.password,
                    description: req.user.description
                  }
              
                res.render("editprofile", {
                    error: response,
                    user: userinfo
                  });
            }
        } catch (e) {
            console.error('Error updating user ', e);
            res.redirect('/edit-profile');
        }

    },
    
    // Function to check if the username is already taken
    checkUsernameAvailability: async function(username) {
        try {
            const user = await User.findOne({ username: username });
            return !!user; // Returns true if a user with the username exists, false otherwise
        } catch (err) {
            console.error('Error while checking username availability:', err);
            return false;
        }
    },
    
    addUser: async function (req, res) {
        const { firstname, lastname, username, email, password } = req.body; // Extract the form data

        try {


            const response = await userController.formValidation(password, username, email);
            console.log(response);
            if (response == true) {
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
            } else {
                res.render("register", {
                    error: response,
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    email: email
                  });
                
            }
            
            // Redirect to a success page or send a success response
            // res.redirect('http://localhost:3000/profile'); // Replace with the appropriate URL for the success page
        
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Server error');
        }
    },

    getReviewsByUserID: async function (req, res) {
        
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
