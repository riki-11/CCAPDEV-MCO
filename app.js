// mongoose
import "dotenv/config";
import db from './db/mongoose.js';

const port = process.env.PORT;


db.connect();

// Require the express module
//const express = require('express');

// Requires the livereload module
// Import the livereload.js file
//require('./livereload');

//const path = require('path');

// Import the express module
import express from 'express';

// Import the livereload.js file (make sure to specify the correct path)
import './livereload.js';

import path from 'path';

const app = express();


app.use(express.static('public'));  // Assuming the CSS file is in the 'public' directory

// listen for requests
//app.listen(3000);

app.listen(port, function () {
  console.log(`Server is running at:`);
  console.log(`http://localhost:` + port);
});

// all the requests are coming from the perspective of app.js which is why we have to exit the current directory and go to the views directory
app.get('', (req, res) => {
  const indexPath = path.join('./views', 'index.html');
  res.sendFile(indexPath);
})

app.get('/register', (req, res) => {
  const indexPath = path.join('./views', 'register.html');
  res.sendFile(indexPath);
})

app.get('/login', (req, res) => {
  const indexPath = path.join('./views', 'login.html');
  res.sendFile(indexPath);
})

// DELETE LATER: For testing any bugs
app.get('/test', (req, res) => {
  const indexPath = path.join('./views', 'test.html');
  res.sendFile(indexPath);
})

app.get('/profile', (req, res) => {
  const indexPath = path.join('./views', 'viewprofile.html');
  res.sendFile(indexPath);
})

app.get('/edit-profile', (req, res) => {
  const indexPath = path.join('./views', 'editprofile.html');
  res.sendFile(indexPath);
})

app.get('/results'), (req, res) => {
  const indexPath = path.join('./views', 'results.html');
  res.sendFile(indexPath);
}

app.get('/search', (req, res) => {
  const indexPath = path.join('./views', 'searchReview.html');
  res.sendFile(indexPath);  
})

app.get('/create-review', (req, res) => {
  const indexPath = path.join('./views', 'createreview.html');
  res.sendFile(indexPath);
})

app.get('/establishment', (req, res) => {
  const indexPath = path.join('./views', 'establishmentview.html');
  res.sendFile(indexPath);  
})

app.get('/establishment-business', (req, res) => {
  const indexPath = path.join('./views', 'business-profile.html');
  res.sendFile(indexPath);  
})

// 404 page
app.use((req, res) => {
  const indexPath = path.join('./views', '404.html');
  res.sendFile(indexPath);
})
