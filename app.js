// mongoose
import "dotenv/config";
import db from './models/mongoose.js';
import multer from 'multer';


// Import equivalent of __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import the express module
import express from 'express';
import bodyParser from 'body-parser';

// Session manager
import session from 'express-session';

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

app.get('/building', async (req, res) => {

});

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

app.get('/profile', (req, res) => {
  res.render("viewprofile", {
    title: "Profile",
    forBusiness: false
  });
});

app.get('/edit-profile', (req, res) => {
  res.render("editprofile", {
    title: "Edit Profile",
    forBusiness: false
  });
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

app.get('/find-restroom', (req, res) => {
  restroomController.getRestroomByInfo(req, res).then(restroomBuilding => {
    //console.log(`RESTROOM BUILDING HERE: ${restroomBuilding}`);
    console.log('cool');
  });

  // After selecting a restroom to review, it should redirect to create-review
  res.redirect("/create-review");
});

// Asynchronous request to get the data of a SPECIFIC building in the database
app.get('/get-building-data', async (req, res) => {
  const allBldgs = await buildingController.getAllBuildings();
  const selectedBldg = req.query.building;
  const matchedBldg = allBldgs.find(building => building.name === selectedBldg);

  // If we successfully found the right bldg in the database, send a response
  if (matchedBldg) {
    res.json(matchedBldg);
  } else {
    res.status(404).send('Building not found');
  }
});

/* END OF ROUTES FOR /select-restroom */

app.get('/create-review', (req, res) => {
  res.render("createreview", {
    title: "Create a Review",
    forBusiness: false
  });
});

app.get('/edit-review', (req, res) => {
  res.render("editreview", {
    title: "Edit My Review",
    forBusiness: false
  });
});

app.get('/establishment', async (req, res) => {
  res.render("establishmentview", {
    title: "Establishment", // replace with title of from db
    forBusiness: false,
  }); 
});

app.get('/establishment-business', (req, res) => {
  res.render("business-profile", {
    title: "My Establishment",
    forBusiness: true
  });
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
app.post('/updateinfo', userController.updateUser);


// 404 page: THIS SHOULD BE AT THE VERY LAST
app.use((req, res) => {
  res.render("404", {
    title: "Error 404",
    forBusiness: false
  });
})
