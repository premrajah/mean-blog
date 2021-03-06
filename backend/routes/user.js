const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const router = express.Router();



/* Signup Route
---------------------------------------------------- */
router.post("/signup", (req, res, next) => {

  //excrype password
  bcrypt.hash(req.body.password, 10)
    .then(hash => {

      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created.',
            result: result
          })

        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        })

    })


});

/* Login Route
-------------------------------------------------------- */
router.post('/login', (req, res, next) => {
  let fetchedUser;
  // check the email in the db against the request
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'User: Auth falied.'
        });
      }

      fetchedUser = user;

      // found user compare the hash with password
      return bcrypt.compare(req.body.password, fetchedUser.password);
    })
    .then(result => {

      if (!result) {
        return res.status(401).json({
          message: 'Result: Auth failed'
        });
      }

      // valid password
      const token = jwt.sign({
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        'secret_this_should_be_longer_than_this_but_i_guess_its_fine', {
          expiresIn: '1h'
        }
      );
      res.status(200).json({
        token: token,
        // token expiry time
        expiresIn: 3600,
        userId: fetchedUser._id
      });

    })
    .catch(err => {
      console.log("hi");
      return res.status(401).json({
        message: 'Error: Auth failed',
        error: err
      });
    });

});




module.exports = router;
