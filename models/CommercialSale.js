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
  available_from: Date,
  Propertytax: String,
  Occupancy: String,


  city: String,
  Locality: String,
  landmark_street: String,
  locality_description: String,


  water_storage: String,
  lift: String,
  powerbackup : String,
  wash : String,
  parking: String,
  security: String,
  Availability: String,
  startTime: String,
  endTime: String,
  Directions : String,


  image: [String],
  ownerId: String, // Array of image URLs
});

// Define a model based on the schema
module.exports = mongoose.model('Commercial_sale', propertySchema);

