const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  description: String
});

module.exports = mongoose.model('about', aboutSchema);
