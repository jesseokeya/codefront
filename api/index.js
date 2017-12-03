const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {credentials, firebase} = require('../config');

/* Post Requests */

router.post('/create', (req, res) => {
  const postSchema = require('../models');
  const post = mongoose.model('post');
  const newPost = new post(req.body);
  newPost.save((err) => {
    if (err) {
      throw err;
    } else {
      res.send({data: req.body, status: 200, message: 'new post successfully saved'});
    }
  });
});

router.post('/admin', (req, res) => {
  const response = {};
  const isValidEmail = (credentials.email === req.body.email);
  const isValidPassword = (credentials.password === req.body.password);
  if (isValidEmail && isValidPassword) {
    response.status = 200;
    response.isValidUser = true;
    response.message = 'valid'
  } else {
    response.status = 404;
    response.isValidUser = false;
    response.message = 'invalid'
  }

  res.send(response);
});

router.post('/contact', (req, res) => {
  const contactSchema = require('../models/contact');
  const contact = mongoose.model('contact');
  const newContact = new contact(req.body);
  newContact.save((err) => {
    if (err) {
      throw err;
    } else {
      res.send({data: req.body, status: 200, message: 'contact successfully saved'});
    }
  });
});

router.post('/update/about', (req, res) => {
  const aboutSchema = require('../models/about');
  const about = mongoose.model('about');
  about.remove({}, (err) => {
    if (err) {
      throw err;
    }
  });
  const newAbout = new about({description: req.body.data});
  newAbout.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send({data: req.body, status: 200, message: 'contact successfully saved'});

    }
  });
});

router.post('/update/post/:index', (req, res) => {
  const postSchema = require('../models');
  const allPosts = mongoose.model('post');

  allPosts.findById(req.body.id, function(err, post) {
    if (err) {
      return handleError(err);
    }
    post.title = req.body.title,
    post.heading = req.body.heading,
    post.author = req.body.author,
    post.subheading = req.body.subheading,
    post.body = req.body.body

    post.save(function(err, updatedPost) {
      if (err) {
        return handleError(err);
      }
      res.send({newPost: updatedPost, isUpdated: true, message: 'Post Was Successfully Updated', status: 200});
    });
  });
});

router.post('/delete/post/:index', (req, res) => {
  const postSchema = require('../models');
  const allPosts = mongoose.model('post');

  allPosts.remove({
    _id: req.body.id
  }, function(err) {
    if (err) {
      return handleError(err);
    }
    res.send({isDeleted: true, message: 'Post Was Successfully Deleted', status: 200});
  });
});

router.post('/comment', (req, res) => {
  const filterReqBody = {
    username: req.body.username,
    date: req.body.date,
    body: req.body.body
  }
  const postSchema = require('../models');
  const post = mongoose.model('post');
  post.update({
    _id: req.body.id
  }, {
    $push: {
      comments: filterReqBody
    }
  }, function(err, result) {
    if (err) {
      throw err
    }
    res.send({status: 200, data: result, message: 'Comment Successfully Created'});
  });
});

/* Get Requests */
router.get('/get/about', (req, res) => {
  const aboutSchema = require('../models/about');
  const about = mongoose.model('about');
  about.find({}, (err, docs) => {
    if (err) {
      throw err;
    }
    res.send({status: 200, data: docs, message: 'Blog About Me Data'});
  });
});

router.get('/getFirebaseConfig', (req, res) => {
  res.send(firebase);
});

router.get('/getAllPosts', (req, res) => {
  const postSchema = require('../models');
  const post = mongoose.model('post');
  post.find({}, function(err, results) {
    if (err) {
      throw err;
    }
    res.send({status: 200, data: results, message: 'All Blog Posts Ever Created'});
  });
});

router.get('/get/post/:index', (req, res) => {
  const postSchema = require('../models');
  const post = mongoose.model('post');
  const indexOfPost = req.params.index;
  post.find({}, function(err, results) {
    if (err) {
      throw err;
    }
    res.send({
      status: 200,
      data: results[indexOfPost - 1],
      message: `successfully Fetched Post Number ${indexOfPost}`
    });
  });
});

const api = router;
module.exports = {
  api
};
