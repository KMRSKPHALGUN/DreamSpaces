const mongoose = require('mongoose');
const commercial_sale_model = require('../models/CommercialSale');
const owners = require('../models/Signup');

exports.commercialSale = async(req, res) => {

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
        const newAd = new commercial_sale_model({
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

        const property = await commercial_sale_model.findOne().sort({_id: -1});
        await owners.updateOne({ _id: req.userId }, {$push: {postedProperties: [property._id]}});

        res.status(201).json({ message: 'Property Posted Successfully' });

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}
