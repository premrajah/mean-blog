const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Post = require('./models/post'); // Post model (mongoose/mongodb)

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


/* POST Request for posts
------------------------------------------------  */
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  // save to db
  post.save()
    .then(createdPost => {
      console.log(createdPost);

      // send a resonse with 201 everything ok new resource created
      res.status(201).json({
        message: "Post added successfully!",
        postId: createdPost._id
      });
    })
    .catch(error => {
      console.log("Post request " + error);
    });

});

// PUT
app.put("/api/posts/:id", (req, res, next) => {

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({
      _id: req.params.id
    }, post)
    .then(() => {
      res.status(200).json({
        message: "Updated successfully! " + req.params.id
      })
    });
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
    })
    .catch(error => {
      console.log("GET request " + error);
    });
});


// GET Single Post
app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id)
  .then(post => {
    if(post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({
        message: "Post not found!"
      });
    }
  })
});


// DELETE
app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({
      _id: req.params.id
    })
    .then(result => {
      console.log(result);

      //send response
      res.status(200).json({
        message: "Deleted successfully!"
      });
    })
    .catch((error) => {
      console.log("delete request ", error);
    });

});


module.exports = app;
