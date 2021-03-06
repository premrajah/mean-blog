const jwt = require('jsonwebtoken');

//

module.exports = (req, res, next) => {

  try {

    // e.g. "Bearer asdjkgsjghgj";
    const token = req.headers.authorization.split(" ")[1];

    // verify token
    const decodedToken = jwt.verify(token, 'secret_this_should_be_longer_than_this_but_i_guess_its_fine');

    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };

    next();

  } catch (error) {
    res.status(401).json({
      message: "Authentication failed.",
      error: console.error(error)
    });
  }


};
