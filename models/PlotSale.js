const mongoose = require('mongoose');


// Define a single schema to encompass all details
const propertySchema = new mongoose.Schema({
 
  plot_area: Number,
  length: Number,
  width: Number,
  bWall: String,
  built_up_area: Number,
  floors : Number,
  project : String,

  Expected_rent: Number,
  rent_negotiable: String,
  available_from: Date,
  Propertytax:String,
  Occupancy :String,


  city: String,
  locality: String,
  landmark_street: String,
  locality_description: String,


  water_supply: String,
  electricity_supply: String,
  sewage_connection : String,
  road : Number,
  security: String,
  Availability: String,
  startTime: String,
  endTime: String,
  Directions : String,

  image: [String],
  ownerId: String, // Array of image URLs
});

// Define a model based on the schema
module.exports = mongoose.model('Plot_sale', propertySchema);

