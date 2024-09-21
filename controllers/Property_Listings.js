const mongoose = require('mongoose');
const res_rent = require('../models/ResidentialRent');
const res_buy = require('../models/ResidentialSale');
const res_flat = require('../models/ResidentialFlatmates');
const com_rent = require('../models/CommercialRent');
const com_buy = require('../models/CommercialSale');
const land_buy = require('../models/PlotSale');
const land_dev = require('../models/PlotDev');
const seller = require('../models/Signup');

exports.property_listings = async (req,res) =>{
    try{
        const {city, property_type, ad_type} = req.body;
        if(property_type === 'residential' && ad_type === 'rent') {
            const property = await res_rent.find({ city: city});
            const len = property.length;
            var owner = [];
            for(var i=0; i<len; i++)
            {
                owner[i] = await seller.findOne({ _id: property[i].ownerId });
            }

            if(property){
                res.status(201).json({ properties: property, owners: owner });
            }
            else {
                res.status(201).json({ properties: '', owners: '' });
            }
        }
        else if(property_type === 'residential' && ad_type === 'buy') {
            const property = await res_buy.find({ city: city});
            const len = property.length;
            var owner = [];
            for(var i=0; i<len; i++)
            {
                owner[i] = await seller.findOne({ _id: property[i].ownerId });
            }

            if(property){
                res.status(201).json({ properties: property, owners: owner });
            }
            else {
                res.status(201).json({ properties: '', owners: '' });
            }
        }
        else if(property_type === 'residential' && ad_type === 'flatmates') {
            const property = await res_flat.find({ city: city});
            const len = property.length;
            var owner = [];
            for(var i=0; i<len; i++)
            {
                owner[i] = await seller.findOne({ _id: property[i].ownerId });
            }

            if(property){
                res.status(201).json({ properties: property, owners: owner });
            }
            else {
                res.status(201).json({ properties: '', owners: '' });
            }
        }
        else if(property_type === 'commercial' && ad_type === 'rent') {
            const property = await com_rent.find({ city: city});
            const len = property.length;
            var owner = [];
            for(var i=0; i<len; i++)
            {
                owner[i] = await seller.findOne({ _id: property[i].ownerId });
            }

            if(property){
                res.status(201).json({ properties: property, owners: owner });
            }
            else {
                res.status(201).json({ properties: '', owners: '' });
            }
        }
        else if(property_type === 'commercial' && ad_type === 'buy') {
            const property = await com_buy.find({ city: city});
            const len = property.length;
            var owner = [];
            for(var i=0; i<len; i++)
            {
                owner[i] = await seller.findOne({ _id: property[i].ownerId });
            }

            if(property){
                res.status(201).json({ properties: property, owners: owner });
            }
            else {
                res.status(201).json({ properties: '', owners: '' });
            }
        }
        else if(property_type === 'land' && ad_type === 'buy') {
            const property = await land_buy.find({ city: city});
            const len = property.length;
            var owner = [];
            for(var i=0; i<len; i++)
            {
                owner[i] = await seller.findOne({ _id: property[i].ownerId });
            }

            if(property){
                res.status(201).json({ properties: property, owners: owner });
            }
            else {
                res.status(201).json({ properties: '', owners: '' });
            }
        }
        else if(property_type === 'land' && ad_type === 'development') {
            const property = await land_dev.find({ city: city});
            const len = property.length;
            var owner = [];
            for(var i=0; i<len; i++)
            {
                owner[i] = await seller.findOne({ _id: property[i].ownerId });
            }

            if(property){
                res.status(201).json({ properties: property, owners: owner });
            }
            else {
                res.status(201).json({ properties: '', owners: '' });
            }
        }
        else{
            res.status(201).json({ properties: '', owners: '' });
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}