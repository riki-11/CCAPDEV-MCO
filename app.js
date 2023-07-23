// mongoose
import "dotenv/config";
import db from './db/mongoose.js';

// Import equivalent of __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import the express module
import express from 'express';

// Import the livereload.js file (make sure to specify the correct path)
import './livereload.js';

import path from 'path';


const port = process.env.PORT;


db.connect();

// Require the express module
//const express = require('express');

// Requires the livereload module
// Import the livereload.js file
//require('./livereload');

//const path = require('path');

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(express.static('public'));  // Assuming the CSS file is in the 'public' directory

// listen for requests
app.listen(port, function () {
  console.log(`Server is running at:`);
  console.log(`http://localhost:` + port);
});

// __dirname = ./public folder


// all the requests are coming from the perspective of app.js which is why we have to exit the current directory and go to the views directory
app.get('', (req, res) => {
  const indexPath = path.join(__dirname, './views', 'index.html');
  res.sendFile(indexPath);
})

app.get('/register', (req, res) => {
  const indexPath = path.join(__dirname, './views', 'register.html');
  res.sendFile(indexPath);
})

app.get('/login', (req, res) => {
  const indexPath = path.join(__dirname, './views', 'login.html');
  res.sendFile(indexPath);
})

// DELETE LATER: For testing any bugs
app.get('/test', (req, res) => {
  const indexPath = path.join(__dirname, './views', 'test.html');
  res.sendFile(indexPath);
})

app.get('/profile', (req, res) => {
  const indexPath = path.join(__dirname, './views', 'viewprofile.html');
  res.sendFile(indexPath);
})

app.get('/edit-profile', (req, res) => {
  const indexPath = path.join(__dirname, './views', 'editprofile.html');
  res.sendFile(indexPath);
})

app.get('/results'), (req, res) => {
  const indexPath = path.join(__dirname, './views', 'results.html');
  res.sendFile(indexPath);
}

app.get('/search', (req, res) => {
  const indexPath = path.join(__dirname, './views', 'searchReview.html');
  res.sendFile(indexPath);  
})

app.get('/create-review', (req, res) => {
  const indexPath = path.join(__dirname, './views', 'createreview.html');
  res.sendFile(indexPath);
})

app.get('/establishment', (req, res) => {
  const indexPath = path.join(__dirname, './views', 'establishmentview.html');
  res.sendFile(indexPath);  
})

app.get('/establishment-business', (req, res) => {
  const indexPath = path.join(__dirname, './views', 'business-profile.html');
  res.sendFile(indexPath);  
})

// 404 page
app.use((req, res) => {
  const indexPath = path.join(__dirname, './views', '404.html');
  res.sendFile(indexPath);
})

app.use((req, res) => {
  const indexPath = path.join(__dirname, './controllers', 'registerController.js');
  res.sendFile(indexPath);
})


// Database access
import User from './db/User.js';
import Building from './db/Building.js';
import Owner from './db/Owner.js';

//listen to post requests in register.html to save into the db
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


// adding data


// add()
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


// query()
async function query() {
  try {
    const user = await User.findMany({firstName: "John"});
    console.log(user);
  } catch (e) {
    console.log(e.message)
  }
}