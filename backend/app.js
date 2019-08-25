const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const postRoutes = require('./routes/posts');

const app = express();

mongoose.connect('mongodb://localhost/mean-blog', {
    useNewUrlParser: true
  })
  // mongoose.connect('mongodb+srv://zinox:i1851WDzb5VYHGdw@cluster0-4sixw.mongodb.net/mean-blog?retryWrites=true&w=majority', {
  //     useNewUrlParser: true
  //   })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Connection failed!");
    console.log("Db Connection error" + error);
  });

app.use(bodyParser.json()); // middleware to parse the reqest body
app.use(bodyParser.urlencoded({
  extended: false
})); // to only support default features

// headers / CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Key|Value (access for all domains)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next(); // call next middle ware
});


app.use('/api/posts', postRoutes);


module.exports = app;
