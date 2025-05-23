const mongoose = require('mongoose');
const residential_rent_model = require('../models/ResidentialRent');
const owners = require('../models/Signup');

exports.residentialRent = async(req, res) => {

    try{
        const{ 
            building_type,
            bhk_type,
            floor_number ,
            total_floors ,
            property_age ,
            facing ,
            built_up_area ,
            expected_rent ,
            expected_deposit ,
            rent_negotiable ,
            monthly_maintenance,
            available_from ,
            preferred_tenants,
            furnishing ,
            parking ,
            rental_description ,
            city ,
            locality,
            landmark_street ,
            locality_description ,
            bathrooms ,
            balcony ,
            water_supply ,
            gym ,
            non_veg ,
            gated_security ,
            availability_to_show_property ,
            start_time,
            end_time,
            amenities,
            image, // Array of image URLs} 
            
        } = req.body;

        const imagePaths = req.files.map(file => file.path);
        const newAd = new residential_rent_model({
            building_type,
            bhk_type,
            floor_number ,
            total_floors ,
            property_age ,
            facing ,
            built_up_area ,
            expected_rent ,
            expected_deposit ,
            rent_negotiable ,
            monthly_maintenance,
            available_from ,
            preferred_tenants,
            furnishing ,
            parking ,
            rental_description ,
            city ,
            locality,
            landmark_street ,
            locality_description ,
            bathrooms ,
            balcony ,
            water_supply ,
            gym ,
            non_veg ,
            gated_security ,
            availability_to_show_property ,
            start_time,
            end_time,
            amenities,
            image: imagePaths,
            ownerId: req.userId, // Array of image URLs} 
        });

        await newAd.save();

        const property = await residential_rent_model.findOne().sort({_id: -1});
        await owners.updateOne({ _id: req.userId }, {$push: {postedProperties: [property._id]}});

        res.status(201).json({ message: 'Property Posted Successfully' });

    }catch(error){
        console.error('Multer error or route crash:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}


const redis = require('../upstashClient');

exports.getAllProperties = async (req, res) => {
  try {
    const cacheKey = 'residential_properties';

    console.time('response-time');

    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsedData = typeof cached === 'string' ? JSON.parse(cached) : cached;
      return res.status(200).json(parsedData);
    }


    const properties = await residential_rent_model.find();

    await redis.set(cacheKey, JSON.stringify(properties), {
      EX: 60 * 5 // cache for 5 mins
    });

    console.timeEnd('response-time');
    res.status(200).json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};