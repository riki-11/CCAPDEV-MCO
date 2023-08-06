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


// Controller Imports
import userController from './controllers/userController.js'; 
import reviewController from './controllers/reviewController.js';
import buildingController from "./controllers/buildingController.js"; 
import restroomController from "./controllers/restroomController.js";
import routeController from "./controllers/routeController.js";

// Database access
import User from './models/User.js';
import Building from './models/Building.js';
import Restroom from './models/Restroom.js';
import Review from './models/Review.js';
import Reply from "./models/Reply.js";

const port = process.env.PORT;

await db.connect();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register Handlebars helpers
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

Handlebars.registerHelper('renderRatingSearch', function (averageRating) {
  const maxRating = 5; // Assuming the maximum rating is 5
  let html = '';
  
  for (let i = 1; i <= maxRating; i++) {
    if (i <= averageRating) {
      html += '<i class="tissue-search fa-solid fa-toilet-paper fa-rotate-270 fa-lg with-rating"></i> ';
    } else {
      html += '<i class="tissue-search fa-solid fa-toilet-paper fa-rotate-270 fa-lg no-rating"></i> ';
    }
  }
  
  return new Handlebars.SafeString(html);
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

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

// Function for user authentication. When a user is logged in (authenticated) then req.user should not be empty
function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Configure passport-local-mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// BEGINNING OF ALL .app functions

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
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 10// 1hr
  }
}))

// initialize passport and make it deal with session
app.use(passport.initialize());
app.use(passport.session());

// Configure middleware to verify login (for logout button)
app.use((req,res,next) => {
  res.locals.loggedIn = function() {
    if (req.user) {
      return true;
    } else {
      return false;
    }
  }

  res.locals.isOwner = function() {
    if(req.user && req.user.isOwner){
      return true; 
    } else {
      return false;
    }
  }
  next();
})

// Setup parser for JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// parse data and images
app.use(bodyParser.urlencoded({ extended: true }));


// ROUTES

// Rendering main pages
app.get("/", routeController.renderHomePage);
app.get('/about', routeController.renderAboutPage);
app.get('/register', routeController.renderRegisterPage);
app.get('/login', routeController.renderLogInPage);
app.get('/profile', loggedIn, routeController.renderProfilePage);
app.get('/edit-profile', loggedIn,routeController.renderEditProfilePage);
app.get('/results', routeController.renderSearchResultsPage);
app.get('/search', routeController.renderFindBathroomPage);
app.get('/create-review', routeController.renderCreateReviewPage);
app.get('/edit-review', routeController.renderEditReviewPage);
app.get('/establishment', routeController.renderEstablishmentPage);


// Searching
app.get('/search-results', routeController.renderSearchResultsPage);
app.get('/review-search', routeController.getReviewSearchResults);

// Fetch Request Routes
app.get('/select-restroom', routeController.getRestroomOptions);
app.get('/find-restroom', loggedIn, restroomController.getRestroomByInfo);
app.get('/get-building-reviews', routeController.getBuildingReviews);
app.get('/get-building-restrooms', routeController.getBuildingRestrooms);
app.get('/get-building-data',  routeController.getBuildingData);
app.get('/get-building-code', routeController.getBuildingCode);
app.get('/update-building-ratings', routeController.updateBuildingRatings);
app.get('/get-replies', reviewController.getAllReplies);

// Handle form submissions
app.post('/usersignup', userController.addUser);
app.post('/createreview', upload.single('photo'), reviewController.addReview);
app.post('/updateinfo',  loggedIn, upload.single('photo'), userController.updateUser);
app.post('/userlogin', passport.authenticate('local', { failureRedirect: '/login' }), userController.loginUser);
app.post('/updatereview', loggedIn,  upload.single('photo'), reviewController.updateReview);
app.post('/postreply', loggedIn, reviewController.addReply);

// Delete reviews
app.delete('/deleteReviews', routeController.deleteReviews);
app.post('/delete-account', userController.deleteUser);

// Log out
app.get('/logout', routeController.logoutUser);

app.delete('/deleteReply', routeController.deleteReply);

// In case path does not exist
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Error 404",
    forBusiness: false
  });
})


async function add() {
  try {
  
    // buildings
    let foundOwner = await User.findOne({ username: 'henrysy' }, '_id');
    let ownerID = foundOwner._id;

    await Building.create ({
      name: 'Henry Sy',
      numOfRestrooms: 24,
      ownerID: ownerID,
      description: 'Henry Sy Sr. Hall houses De La Salle University\'s 14-story library. It is named after the generous benefactor, the late Mr. Henry Sy Sr.',
      photo: './public/images/bldg-henry.jpeg'
    });

    foundOwner = await User.findOne({ username: 'miguelhall' }, '_id');
    ownerID = foundOwner._id;

    await Building.create ({
      name: 'St. Miguel Hall',
      numOfRestrooms: 12,
      ownerID: ownerID,
      description: 'St. Miguel is De La Salle University\'s College of Liberal Arts.',
      photo: './public/images/bldg-miguel.jpeg'
    });

    foundOwner = await User.findOne({ username: 'velascohall' }, '_id');
    ownerID = foundOwner._id;

    await Building.create ({
      name: 'Velasco Hall',
      numOfRestrooms: 12,
      ownerID: ownerID,
      description: 'Velasco Hall features plenty of laboratories and classrooms that foster innovative learning.',
      photo: './public/images/bldg-velasco.jpeg'
    });

    // buildings
    foundOwner = await User.findOne({ username: 'andrew_gonzalez' }, '_id');
    ownerID = foundOwner._id;

    await Building.create ({
      name: 'Br. Andrew Gonzalez',
      numOfRestrooms: 88,
      ownerID: ownerID,
      description: 'Br. Andrew Gonzalez is the tallest higher education building in the Philippines, boasting 21 stories.',
      photo: './public/images/bldg-andrew.jpg'
    });

    foundOwner = await User.findOne({ username: 'gokongwei' }, '_id');
    ownerID = foundOwner._id;

    await Building.create ({
      name: 'Gokongwei Hall',
      numOfRestrooms: 12,
      ownerID: ownerID,
      description: 'Gokongwei Hall is DLSU\'s college of Engineering, and it also contains several laboratories for computer science.',
      photo: './public/images/bldg-goks.jpeg'
    });


    foundOwner = await User.findOne({ username: 'enrique_razon' }, '_id');
    ownerID = foundOwner._id;

    await Building.create ({
      name: 'Enrique Razon',
      numOfRestrooms: 12,
      ownerID: ownerID,
      description: 'Enrique Razon Sports Complex contains an olympic-sized pool, basketball courts, and various gyms and classrooms.',
      photo: './public/images/bldg-razon.jpeg'
    });



    // restrooms
    
    let currBuilding = await Building.findOne({name: 'Br. Andrew Gonzalez'}, '_id');
    currBuilding = await Building.findOne({name: 'Gokongwei Hall'}, '_id');
    currBuilding = await Building.findOne({name: 'Enrique Razon'}, '_id');
    currBuilding = await Building.findOne({name: 'Henry Sy'}, '_id');
    currBuilding = await Building.findOne({name: 'St. Miguel Hall'}, '_id');
    currBuilding = await Building.findOne({name: 'Velasco Hall'}, '_id');
    
    let buildingID = currBuilding._id;
    await Restroom.create ({
      floor: 1,
      gender: 'MALE',
      category: 'STUDENT',
      buildingID: buildingID
    });
    await Restroom.create ({
      floor: 1,
      gender: 'FEMALE',
      category: 'STUDENT',
      buildingID: buildingID
    });
    await Restroom.create ({
      floor: 2,
      gender: 'MALE',
      category: 'STUDENT',
      buildingID: buildingID
    });
    await Restroom.create ({
      floor: 2,
      gender: 'FEMALE',
      category: 'STUDENT',
      buildingID: buildingID
    });
    await Restroom.create ({
      floor: 3,
      gender: 'MALE',
      category: 'STUDENT',
      buildingID: buildingID
    });
    await Restroom.create ({
      floor: 3,
      gender: 'FEMALE',
      category: 'STUDENT',
      buildingID: buildingID
    });
   


  } catch (e) {
    console.log(e.message)
  }
}

