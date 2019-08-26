const mongoose = require('mongoose');

// blueprint
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
});

// convert to model and export
module.exports = mongoose.model('Post', postSchema);


