import db from '../models/mongoose.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

/*
    defines an object which contains functions executed as callback
    when a client requests for `profile` paths in the server
*/
const userController = {

    /*
        executed when the client sends an HTTP GET request `/profile/:idNum`
        as defined in `../routes/routes.js`
    */
    updateUser: async function(req, res) {
        // get user ID, find it in database, then update the database
        const { firstname, lastname, username, email, password, birthday } = req.body;
        const sampleUserID = new mongoose.Types.ObjectId('64bd405a83eecd81b5a069e1'); //Sample for now, but will use user authentication and session IDs
        try {
            const updatedUser = await User.findById(sampleUserID); //userID should be obtained from session

            if (!updatedUser) {
                return res.status(404).send('User not found');
            }

            updatedUser.firstName = firstname;
            updatedUser.lastName = lastname;
            updatedUser.username = username;
            updatedUser.email = email;
            updatedUser.password = password;
            updatedUser.birthday = birthday;

            await updatedUser.save();
            console.log(updatedUser);

            console.log('User updated')
            res.redirect('http://localhost:3000/profile');
        } catch (e) {
            console.error('Error updating user ', e);
            return res.status(500).send('Server error');
        }

    },

    
    addUser: async function (req, res) {
        const { firstname, lastname, username, email, password, birthday } = req.body; // Extract the form data

        try {
            // Create a new user document based on the User schema
            const newUser = new User({
                 firstName: firstname,
                 lastName: lastname,
                 username: username,
                 email: email,
                 password: password,
                 birthday: new Date(birthday) // Convert the string date to a Date object
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

    viewProfile: async function (req, res) {

    },

    loginUser: async function (req, res) {

    }
}

export default userController;
