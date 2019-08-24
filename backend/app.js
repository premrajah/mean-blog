const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // middleware to parse the reqest body
app.use(bodyParser.urlencoded({extended: false})); // to only support default features

// headers / CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Key|Value (access for all domains)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, COntent-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next(); // call next middle ware
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);

  res.status(201).json({
    message: "Post added successfully!"
  });  // send a resonse with 201 everything ok new resource created
});

app.use('/api/posts', (req, res, next) => {

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
