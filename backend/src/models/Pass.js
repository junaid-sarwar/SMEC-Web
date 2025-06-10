// src/models/Pass.js
const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
  passName: {
    type: String,
    required: [true, 'Pass name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Pass name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  passType: {
    type: String,
    enum: ['single', 'weekly', 'monthly', 'yearly', 'seasonal'],
    required: [true, 'Pass type is required'],
    default: 'single'
  },
  validity: {
    type: Number, // in days
    required: [true, 'Validity period is required'],
    min: [1, 'Validity must be at least 1 day']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxUsage: {
    type: Number,
    default: null // null means unlimited
  },
  features: [{
    type: String,
    trim: true
  }],
  termsAndConditions: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better search performance
passSchema.index({ passName: 'text', description: 'text' });
passSchema.index({ passType: 1 });
passSchema.index({ price: 1 });
passSchema.index({ isActive: 1 });

module.exports = mongoose.model('Pass', passSchema);