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
app.get('/search-results', routeController.renderSearchResultsPage);

// Fetch Request Routes
app.get('/select-restroom', routeController.getRestroomOptions);
app.get('/find-restroom', loggedIn, restroomController.getRestroomByInfo);
app.get('/get-building-reviews', routeController.getBuildingReviews);
app.get('/get-building-restrooms', routeController.getBuildingRestrooms);
app.get('/get-building-data',  routeController.getBuildingData);
app.get('/get-building-code', routeController.getBuildingCode);
app.get('/update-building-ratings', routeController.updateBuildingRatings);

// Handle form submissions
app.post('/usersignup', userController.addUser);
app.post('/createreview', upload.single('photo'), reviewController.addReview);
app.post('/updateinfo',  loggedIn, upload.single('photo'), userController.updateUser);
app.post('/userlogin', passport.authenticate('local', { failureRedirect: '/login' }), userController.loginUser);
app.post('/updatereview', loggedIn,  upload.single('photo'), reviewController.updateReview);

// Add Likes and Dislikes
app.post('/addLikes', loggedIn, reviewController.addLikes);
app.post('/addDislikes', loggedIn,  reviewController.addDislikes);

// Delete reviews
app.delete('/deleteReviews', routeController.deleteReviews);

// Log out
app.get('/logout', routeController.logoutUser);

// In case path does not exist
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Error 404",
    forBusiness: false
  });
})

