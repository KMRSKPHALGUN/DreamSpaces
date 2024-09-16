const mongoose = require('mongoose');


// Define a single schema to encompass all details
const propertySchema = new mongoose.Schema({
  apartment_type: String,
  bhk_type: String,
  floor_number: Number,
  total_floors: Number,
  property_age: Number,
  Room_Type : String,
  Tenant_Type : String,
  facing: String,
  built_up_area: Number,

 
  expected_rent: Number,
  expected_deposit: Number,
  rent_negotiable: String,
  monthly_maintenance: String,
  available_from: Date,
  furnishing: String,
  parking: String,
  rental_description: String,

  city: String,
  locality: String,
  landmark_street: String,
  locality_description: String,

  bathrooms: String,
  ac_room : String,
  smoking : String,
  drinking : String,
  balcony: String,
  gym: String,
  gated_security: String,
  availability_to_show_property: String,
  start_time: String,
  end_time: String,
  amenities: Array,


  image: [String],
  ownerId: String, // Array of image URLs
});

// Define a model based on the schema
module.exports = mongoose.model('Residential_flatmates', propertySchema);
