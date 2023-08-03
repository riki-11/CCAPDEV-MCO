// mongoose
import "dotenv/config";
import db from './models/mongoose.js';
import multer from 'multer';
import mongoose from 'mongoose';



// Import equivalent of __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import the express module
import express from 'express';
import bodyParser from 'body-parser';

// Session manager
import session from 'express-session';
import passport from 'passport';

// Import handlebars
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';

// Import the livereload.js file (make sure to specify the correct path)
import './livereload.js';

import path from 'path';

// Controller Imports
import userController from './controllers/userController.js'; 
import reviewController from './controllers/reviewController.js';
import buildingController from "./controllers/buildingController.js"; 
import restroomController from "./controllers/restroomController.js";

// Database access
import User from './models/User.js';
import Building from './models/Building.js';
import Owner from './models/Owner.js';
import Restroom from './models/Restroom.js';
import Review from './models/Review.js';
import { match } from "assert";


const port = process.env.PORT;

db.connect();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// Set View engine as handlebars
app.engine("hbs", exphbs.engine({extname: 'hbs'}));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static(__dirname + '/public'));

// listen for requests
app.listen(port, function () {
  console.log(`Server is running at:`);
  console.log(`http://localhost:` + port);
});

/* Setup session manager and request authentication middleware */ 
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))
// initialize passport and make it deal with session
app.use(passport.initialize());
app.use(passport.session());
// Configure passport-local-mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


Handlebars.registerHelper('renderRating', function (averageRating) {
  const maxRating = 5; // Assuming the maximum rating is 5
  let html = '';

  for (let i = 1; i <= maxRating; i++) {
    if (i <= averageRating) {
      html += '<i class="tissue fa-solid fa-toilet-paper fa-rotate-270 fa-xl with-rating"></i>';
    } else {
      html += '<i class="tissue fa-solid fa-toilet-paper fa-rotate-270 fa-xl no-rating"></i>';
    }
  }

  return new Handlebars.SafeString(html);
});


// ROUTES

// Upon loading the homepage, grab the list of all the buildings
app.get("/", async (req, res) => {
  const allBldgs = await buildingController.getAllBuildings();


  res.render("index", {
    title: "Flush Finder",
    forBusiness: false,
    allBldgs: allBldgs
  });
});

// Register the 'times' helper
const handlebars = exphbs.create({});
handlebars.handlebars.registerHelper('times', function(n, block) {
  let accum = '';
  for (let i = 0; i < n; ++i) {
    accum += block.fn(i);
  }
  return accum;
});


app.get('/register', (req, res) => {
  res.render("register", {
    title: "Sign Up",
    forBusiness: false
  });
});

app.get('/login', (req, res) => {
  res.render("login", {
    title: "Login",
    forBusiness: false
  });
});


app.get('/profile', async (req, res) => {
  const userID = '64bd2ba04e2c41c0fa918e4f';

  try {

    // Fetch user data
    const user = await User.findById(userID).lean();
    if (!user) {
      return res.status(404).send('User not found');
    }

    const reviews = await Review.find({ user: userID })
      .populate({
        path: 'restroomID', // Populate the restroomID field
        populate: {
          path: 'buildingID', // Populate the buildingID field of the nested Restroom model
          select: 'name', // Select only the name property of the buildingID
        },
      })
      .lean();

    const profImgSrc = user.photo && user.photo.contentType ? `data:${user.photo.contentType};base64,${user.photo.data.toString('base64')}` : null;
    res.render('viewprofile', { 
      title: 'Profile',
      forBusiness: false,
      user: user,
      profImgSrc: profImgSrc,
      reviews: reviews.map(review => ({
        ...review,
        user: user,       // Pass the user object to each review
        profImgSrc: profImgSrc, // Pass the imageSrc to each review
        photoSrc: review.photo && review.photo.contentType ? `data:${review.photo.contentType};base64,${review.photo.data.toString('base64')}` : null,      }))    
    }); 
   
    
    

   
    
    

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Server error');
  }
});

app.delete('/deleteReviews', async (req, res) => {
  console.log("app delete");
  const reviewId = req.query.reviewId;


  try {
    // Find the review in the database by its ID
    const result = await Review.deleteOne({_id: reviewId}).exec();

    console.log(result);


    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


app.get('/edit-profile', async (req, res) => {
  const userID = '64bd2ba04e2c41c0fa918e4f'; 

  try {
    // Fetch the user data from the database
    const user = await User.findById(userID).lean();

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.photo && user.photo.contentType) {
      const imageSrc = `data:${user.photo.contentType};base64,${user.photo.data.toString('base64')}`;
      res.render('editprofile', { 
        title: 'Edit Profile',
        forBusiness: false,
        user: user,
        imageSrc: imageSrc,
      });

    } else {
      res.render('editprofile', { 
        title: 'Edit Profile',
        forBusiness: false,
        user: user
      });
    }



  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Server error');
  }
});

app.get('/results', (req, res) => {

  res.render("results", {
    title: "Search Results For ...",
    forBusiness: false
  });
})

app.get('/search', (req, res) => {
  res.render("select-restroom", {
    title: "Search for a Review",
    forBusiness: false
  });
});

/* ROUTES FOR /select-restroom */

// Upon visiting /select-restroom page
app.get('/select-restroom', (req, res) => {
  
  // Get all the buildings from the database
  buildingController.getAllBuildings().then(buildings => {
    var buildingNames = [];
    var buildingFloors = [];
    buildings.forEach(building => {
      // Grab the names of all the buildings
      buildingNames.push(building.name);

      // Grab the number of floors per building
      buildingFloors.push(building.numOfFloors);
    })

    res.render("select-restroom",  {
      title: "Select a Restroom To Review",
      forBusiness: false, 
      buildings: buildings,
      buildingNames: buildingNames,
      buildingFloors: buildingFloors
    })
  });
});

app.get('/find-restroom', restroomController.getRestroomByInfo);

// Asynchronous request to get the data of a SPECIFIC building in the database
app.get('/get-building-data',  async (req, res) => {
  const building = await buildingController.getBuildingByName(req.query.building);
  // If we successfully found the right bldg in the database, send a response
  if (building) {
    res.json(building);
  } else {
    res.status(404).send('Building not found');
  }
});

// Asynchronous request go get a building's specific code
app.get('/get-building-code', async (req, res) => {
  const buildingCode = await buildingController.getBuildingCode(req.query.building);
  if (buildingCode) {
    res.json(buildingCode);
  } else {
    res.status(404).send('Building not found');
  }
})
/* END OF ROUTES FOR /select-restroom */


app.get('/create-review', (req, res) => {
  const { name, floor, gender, restroomId } = req.query;
  const dataToSend = {
    name: name,
    floor: floor,
    gender: gender,
    restroomId: restroomId
  };

  res.render('createreview', { data: dataToSend });
});

app.get('/edit-review', async (req, res) => {

  try {
    const reviewId = req.query.reviewId;
    const review = await Review.findById(reviewId).lean();
    const restroom = await Restroom.findById(review.restroomID).lean();
    const building = await Building.findById(restroom.buildingID).lean();

    // for the boolean conditions in editreview
    const hasBidet = review.amenities.includes("bidet");
    const hasFaucet = review.amenities.includes("faucet");
    const hasFlush = review.amenities.includes("flush");
    const hasTissue = review.amenities.includes("tissue");
    const hasHanddryer = review.amenities.includes("handdryer");

    const rated1 = (review.rating == 1);
    const rated2 = (review.rating == 2);
    const rated3 = (review.rating == 3);
    const rated4 = (review.rating == 4);
    const rated5 = (review.rating == 5);

    const dateCreated = new Date(review.dateCreated).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    
    res.render("editreview", {
      title: "Edit My Review",
      forBusiness: false,
      review: review,
      building: building,
      restroom: restroom,
      date: dateCreated,
      amenities: {
        bidet: hasBidet,
        faucet: hasFaucet,
        flush: hasFlush,
        tissue: hasTissue,
        handdryer: hasHanddryer
      },
      ratings: {
        rated1: rated1,
        rated2: rated2,
        rated3: rated3,
        rated4: rated4,
        rated5: rated5
      },
      photoSrc: review.photo && review.photo.contentType ? `data:${review.photo.contentType};base64,${review.photo.data.toString('base64')}` : null, 

    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Server error');  
  }
});

app.get('/establishment', async (req, res) => {

  try {
    const buildingName = req.query.building;
    const building = await buildingController.getBuildingByName(buildingName);
    console.log(building);

    if (!building) {
      res.redirect('/404');
    }

    res.render("establishmentview", {
      title: buildingName, // replace with title of from db
      forBusiness: false,
      building: building
    }); 

  } catch (error) {
    res.status.send('Server error');
  }

});

app.get('/establishment-business', (req, res) => {
  res.render("business-profile", {
    title: "My Establishment",
    forBusiness: true
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login'); // Redirect to login page after logout
});

// CONTROLLER METHODS

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));


const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});


// Define a route for handling the form submission
app.post('/usersignup', userController.addUser);
app.post('/createreview', upload.single('photo'), reviewController.addReview);
app.post('/updateinfo',  upload.single('photo'), userController.updateUser);
app.post('/userlogin', userController.loginUser);
// app.post('/userlogin', passport.authenticate('local', {
//   successRedirect: 'http://localhost:3000',
//   failureRedirect: '/login'
// }));
app.post('/updatereview', upload.single('photo'), reviewController.updateReview);


// 404 page: THIS SHOULD BE AT THE VERY LAST
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Error 404",
    forBusiness: false
  });
})
