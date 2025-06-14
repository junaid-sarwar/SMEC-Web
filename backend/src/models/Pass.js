const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
  passName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pass', passSchema);