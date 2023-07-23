// mongoose
import "dotenv/config";
import db from './models/mongoose.js';

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

  app.get("/", buildingController.getAllBuildings);

});


app.get('/register', (req, res) => {
  res.render("register", {
    title: "Sign Up",
    forBusiness: false
  });
})

app.get('/login', (req, res) => {
  res.render("login", {
    title: "Login",
    forBusiness: false
  });
})

app.get('/profile', (req, res) => {
  res.render("viewprofile", {
    title: "Profile",
    forBusiness: false
  });
})

app.get('/edit-profile', (req, res) => {
  res.render("editprofile", {
    title: "Edit Profile",
    forBusiness: false
  });
})

app.get('/results'), (req, res) => {
  res.render("results", {
    title: "Search Results For ...", // complete it
    forBusiness: false
  });
}

app.get('/search', (req, res) => {
  res.render("select-restroom", {
    title: "Search for a Review",
    forBusiness: false
  });
})

app.get('/select-restroom', (req, res) => {
  res.render("select-restroom",  {
    title: "Select a Restroom To Review",
    forBusiness: false
  })
})

app.get('/create-review', (req, res) => {
  res.render("createreview", {
    title: "Create a Review",
    forBusiness: false
  });
})

app.get('/edit-review', (req, res) => {
  res.render("editreview", {
    title: "Edit My Review",
    forBusiness: false
  });
})

app.get('/establishment', (req, res) => {
  res.render("establishmentview", {
    title: "Establishment", // replace with title of from db
    forBusiness: false
  }); 
})

app.get('/establishment-business', (req, res) => {
  res.render("business-profile", {
    title: "My Establishment",
    forBusiness: true
  });
})


// get form 
import userController from './controllers/userController.js'; 
import reviewController from './controllers/reviewController.js';
import buildingController from "./controllers/buildingController.js"; 

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for handling the form submission
app.post('/usersignup', userController.addUser);
app.post('/createreview', reviewController.addReview);
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


// Database access
import User from './models/User.js';
import Building from './models/Building.js';
import Owner from './models/Owner.js';
import Restroom from './models/Restroom.js';



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
    let user = await User.create ({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe123',
      password: 'secret123',
      email: 'johndoe@example.com',
      birthday: new Date('1990-01-01') // Provide the birthday as a Date object
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

    // restrooms
    let currBuilding = await Building.findOne({name: 'Henry Sy'}, '_id');
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

    currBuilding = await Building.findOne({name: 'St. Miguel Hall'}, '_id');
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

    currBuilding = await Building.findOne({name: 'Velasco Hall'}, '_id');
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