const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {credentials, firebase} = require('../config');
const {parseEmaiContents} = require('./helper');
const axios = require('axios');
let contactEmailTemp = null;

let api_keys = null;
const _urlApiKeys = `https://notify-dev.herokuapp.com/api/api_keys`;
axios.get(_urlApiKeys).then((response) => {
  api_keys = response.data;
}).catch((error) => {
  if (error) {
    throw err;
  };
});

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
      if (req.body.email) {
        const sendwithus_key = api_keys.sendwithus_key;
        const email_config = {
          template: api_keys.template,
          recipient: {
            address: 'jesseokeya@gmail.com'
          },
          template_data: {
            first_name: req.body.name,
            notify_message: req.body.message
          },
          sender: {
            address: 'no-rely@codefront.com', // required
            name: 'codefront'
          },
          esp_account: api_keys.esp_account
        }
        const emailPostRequest = {
          sendwithus_key: sendwithus_key,
          email_config: email_config
        };
        const _url = `https://notify-dev.herokuapp.com/api/send_email`;
        axios.post(_url, emailPostRequest).then((response) => {
          return response;
        }).catch((error) => {
          if(error){
            throw error;
          }
        });
        /* accountSid and authToken from twilio */
        const twilio_config = {
          accountSid: api_keys.twilio_config.accountSid,
          authToken: api_keys.twilio_config.authToken
        }

        const message_config = {
          to: '+16134135540',
          from: '+16042293585',
          body: req.body.message + `- from ${req.body.name}`
        }

        /* expected sample JSON object */
        const textPostRequest = {
          twilio_config: twilio_config,
          message_config: message_config
        }
        const _url0 = `https://notify-dev.herokuapp.com/api/send_text`;
        axios.post(_url0, textPostRequest).then(function(response) {
          return response;
        }).catch(function(error) {
          if (error) {
            throw error;
          }
        });
      }
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
