const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const res_rent = require('../models/ResidentialRent');
const res_buy = require('../models/ResidentialSale');
const res_flat = require('../models/ResidentialFlatmates');
const com_rent = require('../models/CommercialRent');
const com_buy = require('../models/CommercialSale');
const land_buy = require('../models/PlotSale');
const land_dev = require('../models/PlotDev');
const seller = require('../models/Signup');
// const SavedProperties = require('../models/save_property');

exports.userDetails = async(req,res)=>{
    try{
        var property = [];
        property = property.concat(await res_rent.find({ownerId: req.userId}));
        property = property.concat(await res_buy.find({ownerId: req.userId}));
        property = property.concat(await res_flat.find({ownerId: req.userId}));
        property = property.concat(await com_rent.find({ownerId: req.userId}));
        property = property.concat(await com_buy.find({ownerId: req.userId}));
        property = property.concat(await land_buy.find({ownerId: req.userId}));
        property = property.concat(await land_dev.find({ownerId: req.userId}));
        const owner = await seller.findOne({ _id: req.userId });
        const len = property.length;

        var s_len;
        var s_property = [];
        var s_owner = [];
        if(owner.savedProperties) {
            s_len = owner.savedProperties.length;
            var s_property = [];
            var s_owner = [];
            if(s_len>0) {
                for(var i=0; i<s_len; i++)
                {
                    if(await res_rent.findOne({_id: owner.savedProperties[i]})) {
                        s_property = s_property.concat(await res_rent.findOne({_id: owner.savedProperties[i]}));
                    }
                    else if(await res_buy.findOne({_id: owner.savedProperties[i]})) {
                        s_property = s_property.concat(await res_buy.findOne({_id: owner.savedProperties[i]}));
                    }
                    else if(await res_flat.findOne({_id: owner.savedProperties[i]})) {
                        s_property = s_property.concat(await res_flat.findOne({_id: owner.savedProperties[i]}));
                    }
                    else if(await com_rent.findOne({_id: owner.savedProperties[i]})) {
                        s_property = s_property.concat(await com_rent.findOne({_id: owner.savedProperties[i]}));
                    }
                    else if(await com_buy.findOne({_id: owner.savedProperties[i]})) {
                        s_property = s_property.concat(await com_buy.findOne({_id: owner.savedProperties[i]}));
                    }
                    else if(await land_buy.findOne({_id: owner.savedProperties[i]})) {
                        s_property = s_property.concat(await land_buy.findOne({_id: owner.savedProperties[i]}));
                    }
                    else if(await land_dev.findOne({_id: owner.savedProperties[i]})) {
                        s_property = s_property.concat(await land_dev.findOne({_id: owner.savedProperties[i]}));
                    }
                    s_owner = s_owner.concat(await seller.findOne({_id: s_property[i].ownerId}));
                }
            }
        }
        res.status(200).json({ property: property, len: len, owner: owner, s_owner: s_owner, s_len: s_len, s_property: s_property });
    }
    catch(error){
        console.error(error);
        res.status(401).json({ error: 'Something went wrong' });
    }
}

exports.deleteAccount = async(req,res) => {
    try {
        const {password} = req.body;
        const client = await seller.findOne({_id: req.userId});
        const match = await bcrypt.compare(password, client.password);
        if(match) {
            await res_rent.deleteMany({ownerId: client._id});
            await res_buy.deleteMany({ownerId: client._id});
            await res_flat.deleteMany({ownerId: client._id});
            await com_buy.deleteMany({ownerId: client._id});
            await com_rent.deleteMany({ownerId: client._id});
            await land_buy.deleteMany({ownerId: client._id});
            await land_dev.deleteMany({ownerId: client._id});
            await seller.deleteOne({_id: client._id});
            res.status(200).json({message: "Account Deleted Permenantly"});
        }
        else {
            res.status(401).json({ error: 'Current Passowrd is wrong' });
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Something went wrong' });
    }
}

exports.deleteProperty = async(req, res) => {
    try {
        const { propertyId } = req.body;
        // Delete the property from the Property collection
        await res_rent.deleteOne({ _id: propertyId });
        await res_buy.deleteOne({ _id: propertyId });
        await res_flat.deleteOne({ _id: propertyId });
        await com_rent.deleteOne({ _id: propertyId });
        await com_buy.deleteOne({ _id: propertyId });
        await land_buy.deleteOne({ _id: propertyId });
        await land_dev.deleteOne({ _id: propertyId });
        

        // Remove the property from the owner's postedProperties array
        await seller.updateOne(
            { _id: req.userId }, // Assuming ownerId is stored in the property document
            { $pull: { postedProperties: propertyId } }
        );

        // Remove the property from savedProperties arrays of other users
        await seller.updateMany(
            { savedProperties: propertyId },
            { $pull: { savedProperties: propertyId } }
        );

        return res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}