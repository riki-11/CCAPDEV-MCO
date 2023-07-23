import db from '../models/mongoose.js';

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
    updateUser: async function(req, rest) {
        
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
        
    }

}

export default userController;
