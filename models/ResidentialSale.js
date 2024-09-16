const mongoose = require('mongoose');


// Define a single schema to encompass all details
const propertySchema = new mongoose.Schema({
  apartment_type: String,
  bhk_type: String,
  floor_number: Number,
  total_floors: Number,
  property_age: Number,
  facing: String,
  built_up_area: Number,
  expected_price: Number,
  price_negotiable: String,
  available_from: Date,
  kitchen_type: String,
  furnishing: String,
  parking: String,
  property_tax: String,
  occupancy_certificate: String,
  sale_description: String,
  city: String,
  locality: String,
  landmark_street: String,
  locality_description: String,
  bathrooms: Number,
  balcony: Number,
  water_supply: String,
  gym: String,
  non_veg: String,
  gated_security: String,
  availability: String,
  start_time: String,
  end_time: String,
  amenities: Array,
  image: [String],
  ownerId: String, // Array of image URLs
});

// Define a model based on the schema
module.exports = mongoose.model('Residential_sale', propertySchema);

