const mongoose = require('mongoose');
const commercial_rent_model = require('../models/CommercialRent');
const owners = require('../models/Signup');

exports.commercialRent = async(req, res) => {

    try{
        const{ 
            property_type,
            building_type ,
            floors,
            totalfloor,
            age,
            builtuparea,
            carpetarea,
            furnish,
          
            Expected_rent,
            Rent_Negotiable,
            Expected_deposit ,
            lease,
            available_from,
            Propertytax,
            Occupancy,
          
          
            city,
            locality,
            landmark_street,
            locality_description,
          
          
            wash,
            lift,
            powerbackup ,
            water_supply,
            parking,
            security,
            Availability,
            start_time,
            end_time,
            Directions
            
        } = req.body;

        const imagePaths = req.files.map(file => file.path.slice(18, file.path.length));
        const newAd = new commercial_rent_model({
            property_type,
            building_type ,
            floors,
            totalfloor,
            age,
            builtuparea,
            carpetarea,
            furnish,
          
            Expected_rent,
            Rent_Negotiable,
            Expected_deposit,
            lease,
            available_from,
            Propertytax,
            Occupancy,
          
          
            city,
            locality,
            landmark_street,
            locality_description,
          
          
            wash,
            lift,
            powerbackup ,
            water_supply,
            parking,
            security,
            Availability,
            start_time,
            end_time,
            Directions,
          
          
            image: imagePaths,
            ownerId: req.userId,
        });

        await newAd.save();

        const property = await commercial_rent_model.findOne().sort({_id: -1});
        await owners.updateOne({ _id: req.userId }, {$push: {postedProperties: [property._id]}});

        res.status(201).json({ message: 'Property Posted Successfully' });

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}
