const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Post = require('./models/post'); // Post model (mongoose/mongodb)

const app = express();

mongoose.connect('mongodb+srv://zinox:i1851WDzb5VYHGdw@cluster0-4sixw.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Connection failed!");
    console.log(error);
  });

app.use(bodyParser.json()); // middleware to parse the reqest body
app.use(bodyParser.urlencoded({
  extended: false
})); // to only support default features

// headers / CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Key|Value (access for all domains)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next(); // call next middle ware
});


/* POST Request for posts
------------------------------------------------  */
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);

  res.status(201).json({
    message: "Post added successfully!"
  }); // send a resonse with 201 everything ok new resource created
});


/* GET Request for posts
------------------------------------------------  */
app.get('/api/posts', (req, res, next) => {

  const posts = [{
      id: "fadf123421l",
      title: " First server side post",
      content: "first server side content"
    },
    {
      id: "dfghjkliiut",
      title: " second server side post",
      content: "second server side content"
    }
  ];

  res.status(200).json({
    message: 'Post fetched succesfully!',
    posts: posts
  });
});

module.exports = app;
