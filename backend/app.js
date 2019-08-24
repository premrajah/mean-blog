const express = require('express');

const app = express();

// headers / CORS
app.use((req, res, next) => {


  next(); // call next middle ware
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
