// models/propertyListing.js
const mongoose = require('mongoose');

const propertyListingSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  propertySize: {
    type: String,
    required: true,
  },
  propertySizeUnit: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  coverImageIndex: {
    type: Number,
    default: null,
  },
});

const PropertyListing = mongoose.model('PropertyListing', propertyListingSchema);

module.exports = PropertyListing;
