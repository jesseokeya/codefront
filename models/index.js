const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  heading: String,
  subheading: String,
  body: String,
  images: [
    {
      url: String,
      alt: String
    }
  ],
  comments: [
    {
      username: String,
      body: String,
      date: Date
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

module.exports = mongoose.model('post', postSchema);
