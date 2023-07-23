// mongoose
import "dotenv/config";
import db from './db/mongoose.js';

// Import equivalent of __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import the express module
import express from 'express';

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
})

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
  res.render("searchReview", {
    title: "Search for a Review",
    forBusiness: false
  });
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

// 404 page
app.use((req, res) => {
  res.render("404", {
    title: "Error 404",
    forBusiness: false
  });
})

app.use((req, res) => {
  const indexPath = path.join(__dirname, './controllers', 'registerController.js');
  res.sendFile(indexPath);
})


// Database access
import User from './db/User.js';
import Building from './db/Building.js';
import Owner from './db/Owner.js';



// adding data

add()
async function add() {
  try {
    const user = await User.create ({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe123',
      password: 'secret123',
      email: 'johndoe@example.com',
      birthday: new Date('1990-01-01') // Provide the birthday as a Date object
    });
    const owner = await Owner.create ({
      username: 'henrysy',
      password: 'secret123',
      email: 'henrysy@example.com',
    });

    const foundOwner = await Owner.findOne({ username: 'henrysy' }, '_id');
    const ownerID = foundOwner._id;

    const building = await Building.create ({
      name: 'Henry Sy',
      numOfRestrooms: 12,
      ownerID: ownerID,
      description: 'hello world',
      averageRating: 5,
    });

    console.log(user);
    console.log(owner);
    console.log(building);

  } catch (e) {
    console.log(e.message)
  }
}


query()
async function query() {
  try {
    const user = await User.findMany({firstName: "John"});
    console.log(user);
  } catch (e) {
    console.log(e.message)
  }
}