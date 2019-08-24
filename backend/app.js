const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Post = require('./models/post'); // Post model (mongoose/mongodb)

const app = express();

mongoose.connect('mongodb+srv://zinox:i1851WDzb5VYHGdw@cluster0-4sixw.mongodb.net/mean-blog?retryWrites=true&w=majority', {
    useNewUrlParser: true
  })
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

  post.save(); // save to db

  res.status(201).json({
    message: "Post added successfully!"
  }); // send a resonse with 201 everything ok new resource created
});


/* GET Request for posts
------------------------------------------------  */
app.get('/api/posts', (req, res, next) => {

  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Post fetched succesfully!',
        posts: documents
      });

    });

});

module.exports = app;
