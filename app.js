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

// Import handlebars
import exphbs from 'express-handlebars';

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

// ROUTES
app.get("/", (req, res) => {
  res.render("index", {
    title: "Flush Finder",
    forBusiness: false
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

    // Fetch reviews data using the getReviewsByUserID function
    const reviews = await userController.getReviewsByUserID();

    // Render the "viewprofile" template with both user and reviews data
    res.render("viewprofile", {
      title: "Profile",
      forBusiness: false,
      user: user,
      reviews: reviews,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Server error');
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

    res.render('editprofile', { 
      title: 'Edit Profile',
      forBusiness: false,
      user: user // Pass the user data to the template
    });

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

    console.log(buildingNames);


    res.render("select-restroom",  {
      title: "Select a Restroom To Review",
      forBusiness: false, 
      buildingNames: buildingNames,
      buildingFloors: buildingFloors
    })
  });
});

app.get('/find-restroom', (req, res) => {
  restroomController.getRestroomByInfo(req, res).then(restroomBuilding => {
    console.log(`RESTROOM BUILDING HERE: ${restroomBuilding}`);
  });

  // After selecting a restroom to review, it should redirect to create-review
  res.redirect("/create-review")
});

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

app.get('/establishment', (req, res) => {
  res.render("establishmentview", {
    title: "Establishment", // replace with title of from db
    forBusiness: false
  }); 
});

app.get('/establishment-business', (req, res) => {
  res.render("business-profile", {
    title: "My Establishment",
    forBusiness: true
  });
});

// CONTROLLER METHODS

// get form 


// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for handling the form submission
app.post('/usersignup', userController.addUser);

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

app.post('/updateinfo', upload.single('photo'), userController.updateUser);
app.post('/createreview', upload.single('photo'), reviewController.addReview);


//app.post()
//App session middleware
// app.use(session({
//   secret: 
//   cookie: { maxAge: }
//   saveUnitialized: 
// }))



// 404 page: THIS SHOULD BE AT THE VERY LAST
app.use((req, res) => {
  res.render("404", {
    title: "Error 404",
    forBusiness: false
  });
})

//listen to post requests in register.html to save into the db
/*
app.post('./register', async (req, res) => {
  try {
    const addUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.lastName,
      email: req.body.email,
      birthday: req.body.birthday
    })
    addUser.save();
    console.log(addUser)
  } catch (e) {
    console.log(e);
  }

})
async function addUser() {
  try {
    this.req.body

  } catch (e) {
    console.log(e)
  }
}
*/

// adding data
/*

add()
async function add() {
  try {
    // users
    await User.create({
      firstName: 'William',
      lastName: 'Anderson',
      username: 'wanderson',
      password: 'password123',
      email: 'william.anderson@example.com',
      birthday: new Date('1982-03-17')
    });

    await User.create({
      firstName: 'Emily',
      lastName: 'Brown',
      username: 'emilyb',
      password: '12345678',
      email: 'emily.brown@example.com',
      birthday: new Date('1993-09-08')
    });

    await User.create({
      firstName: 'Michael',
      lastName: 'Johnson',
      username: 'michaelj',
      password: 'securepw',
      email: 'michael.johnson@example.com',
      birthday: new Date('1988-11-25')
    });

    await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'janesmith456',
      password: 'pass123',
      email: 'jane.smith@example.com',
      birthday: new Date('1985-05-12')
    });

    // owners
    await Owner.create ({
      username: 'andrewgonzalez',
      password: 'password123',
      email: 'andrewgonzalez@gmail.com',
    });

    await Owner.create ({
      username: 'goks',
      password: 'password456',
      email: 'goks@gmail.com'
    });

    // owners
    await Owner.create ({
      username: 'henrysy',
      password: 'secret123',
      email: 'henrysy@gmail.com',
    });

    await Owner.create ({
      username: 'miguelhall',
      password: 'secret456',
      email: 'miguelhall@gmail.com'
    });

    await Owner.create ({
      username: 'velascohall',
      password: 'secret789',
      email: 'velascohall@gmail.com'
    });

    // buildings
    let foundOwner = await Owner.findOne({ username: 'henrysy' }, '_id');
    let ownerID = foundOwner._id;

    await Building.create ({
      name: 'Henry Sy',
      numOfRestrooms: 24,
      ownerID: ownerID,
      description: 'Henry Sy Sr. Hall houses De La Salle University\'s 14-story library. It is named after the generous benefactor, the late Mr. Henry Sy Sr.',
      averageRating: 5,
      photo: './public/images/bldg-henry.jpeg'
    });

    foundOwner = await Owner.findOne({ username: 'miguelhall' }, '_id');
    ownerID = foundOwner._id;

    await Building.create ({
      name: 'St. Miguel Hall',
      numOfRestrooms: 12,
      ownerID: ownerID,
      description: 'St. Miguel is De La Salle University\'s College of Liberal Arts.',
      averageRating: 4,
      photo: './public/images/bldg-miguel.jpeg'
    });

    foundOwner = await Owner.findOne({ username: 'velascohall' }, '_id');
    ownerID = foundOwner._id;

    await Building.create ({
      name: 'Velasco Hall',
      numOfRestrooms: 12,
      ownerID: ownerID,
      description: 'Velasco Hall features plenty of laboratories and classrooms that foster innovative learning.',
      averageRating: 4,
      photo: './public/images/bldg-velasco.jpeg'
    });

    // buildings
    let foundOwner = await Owner.findOne({ username: 'andrewgonzalez' }, '_id');
    let ownerID = foundOwner._id;

    await Building.create ({
      name: 'Br. Andrew Gonzalez',
      numOfRestrooms: 88,
      ownerID: ownerID,
      description: 'Br. Andrew Gonzalez is the tallest higher education building in the Philippines, boasting 21 stories.',
      averageRating: 4,
      photo: './public/images/bldg-andrew.jpg'
    });

    foundOwner = await Owner.findOne({ username: 'goks' }, '_id');
    ownerID = foundOwner._id;

    await Building.create ({
      name: 'Gokongwei Hall',
      numOfRestrooms: 12,
      ownerID: ownerID,
      description: 'Gokongwei Hall is DLSU\'s college of Engineering, and it also contains several laboratories for computer science.',
      averageRating: 1,
      photo: './public/images/bldg-goks.jpeg'
    });


    // restrooms
    let currBuilding = await Building.findOne({name: 'Br. Andrew Gonzalez'}, '_id');
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

    currBuilding = await Building.findOne({name: 'Gokongwei Hall'}, '_id');
    buildingID = currBuilding._id;
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


  } catch (e) {
    console.log(e.message)
  }
}

*/
/*
// query()
async function query() {
  try {
    const user = await User.findMany({firstName: "John"});
    console.log(user);
  } catch (e) {
    console.log(e.message)
  }
}*/

