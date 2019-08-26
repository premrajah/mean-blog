const express = require('express');
const multer = require('multer');

const Post = require('../models/post'); // Post model (mongoose/mongodb)

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // error checking
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }

    cb(error, "backend/images");  // path relative to serve.js
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '_' + Date.now() + extension);
  }
});


/* POST Request for posts
------------------------------------------------  */
router.post("", multer(storage).single("image"), (req, res, next) => {
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
router.put("/:id", (req, res, next) => {

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
router.get('', (req, res, next) => {

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
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({
          message: "Post not found!"
        });
      }
    })
});


// DELETE
router.delete('/:id', (req, res, next) => {
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


module.exports = router;
