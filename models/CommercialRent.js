const mongoose = require('mongoose');


// Define a single schema to encompass all details
const propertySchema = new mongoose.Schema({
  property_type: String,
  building_type : String,
  floors: Number,
  totalfloor: Number,
  age: Number,
  builtuparea : Number,
  carpetarea : Number,
  furnish : String,

  Expected_rent: Number,
  Rent_Negotiable: String,
  Expected_deposit : Number,
  lease: Number,
  available_from: Date,
  Propertytax: String,
  Occupancy: String,


  city: String,
  locality: String,
  landmark_street: String,
  locality_description: String,


  wash: String,
  lift: String,
  powerbackup : String,
  water_supply: String,
  parking: String,
  security: String,
  Availability: String,
  start_time: String,
  end_time: String,
  Directions : String,


  image: [String],
  ownerId: String, // Array of image URLs
});

// Define a model based on the schema
module.exports = mongoose.model('Commercial_rent', propertySchema);

