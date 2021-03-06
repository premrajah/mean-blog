const express = require('express');
const multer = require('multer');

const Post = require('../models/post'); // Post model (mongoose/mongodb)
const checkAuth = require('../middleware/check-auth');

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
    if (isValid) {
      error = null;
    }

    cb(error, "backend/images"); // path relative to serve.js
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '_' + Date.now() + extension);
  }
});


/* POST Request for posts
------------------------------------------------  */
router.post("", checkAuth, multer({
  storage: storage
}).single("image"), (req, res, next) => {

  const url = req.protocol + '://' + req.get('host'); // current host

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });

  // save to db
  post.save()
    .then(createdPost => {
      console.log(createdPost);

      // send a resonse with 201 everything ok new resource created
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          id: createdPost._id,
          ...createdPost
        }
      });
    })
    .catch(error => {
      console.log("Post request " + error);
    });

});

/* UPDATE/PUT POST
-------------------------------------------- */
router.put("/:id", checkAuth, multer({
  storage: storage
}).single("image"), (req, res, next) => {

  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + '://' + req.get('host'); // current host
    imagePath = url + '/images/' + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Post.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    }, post)
    .then(result => {

      // check if post was modified with postId and userId
      if(result.nModified > 0) {
        res.status(200).json({
          message: "Updated successfully! " + req.params.id
        })
      } else {
        res.status(401).json({
          message: "Not Authorized."
        })
      }

    });
});


/* GET Request for posts
------------------------------------------------  */
router.get('', (req, res, next) => {

  // for pagination
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();

  let fetchedPost;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery.find()
    .then(documents => {

      fetchedPost = documents;

      // for pagination
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Post fetched succesfully!',
        posts: fetchedPost,
        maxPosts: count
      });
    })
    .catch(error => {
      console.log("GET request " + error);
    });
});


/* GET Single POST
--------------------------------------------- */
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


/*  DELETE POST
-------------------------------------------- */
router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    })
    .then(result => {
      // check if post was modified with postId and userId
      if(result.n > 0) {
        res.status(200).json({
          message: "Deleted successfully! " + req.params.id
        })
      } else {
        res.status(401).json({
          message: "Not Authorized."
        })
      }
    })
    .catch((error) => {
      console.log("delete request ", error);
    });

});


module.exports = router;
