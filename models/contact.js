const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String
});

module.exports = mongoose.model('contact', contactSchema);
