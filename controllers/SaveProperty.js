const mongoose = require('mongoose');
const users = require('../models/Signup');

exports.save_property = async(req,res) => {
    try {
        const {propId} = req.body;
        const id = req.userId;
        const client = await users.findOne({_id: id});
        if(!client.savedProperties)
        {
            await users.updateOne({ _id: id }, { savedProperties: [propId] });
            res.status(200).json({message: 'Property Saved Successfully'});
        }
        else
        {
            client.savedProperties = client.savedProperties.concat(propId);
            const uniqueElements = new Set(client.savedProperties);
            // Check if the size of the Set is different from the original array
            if (uniqueElements.size !== client.savedProperties.length) {
                res.status(200).json({message2: 'You have already saved this property'});   
            }
            else {
                await users.updateOne({ _id: id },{$push: { savedProperties: [propId] }});
                res.status(200).json({message: 'Property Saved Successfully'});
            }
        }
    }
    catch(error) {
        console.log(error);
        res.status(401).json({error: 'Something went wrong'});
    }
}