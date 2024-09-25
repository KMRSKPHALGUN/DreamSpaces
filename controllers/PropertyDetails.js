const mongoose = require('mongoose');
const res_rent = require('../models/ResidentialRent');
const res_buy = require('../models/ResidentialSale');
const res_flat = require('../models/ResidentialFlatmates');
const com_rent = require('../models/CommercialRent');
const com_buy = require('../models/CommercialSale');
const land_buy = require('../models/PlotSale');
const land_dev = require('../models/PlotDev');
const seller = require('../models/Signup');
const reviews = require('../models/Reviews');

exports.viewProperty = async (req,res) =>{
    try{
        const object_id = req.body.propertyId;
        const resRent = await res_rent.findOne({ _id: object_id });
        const resBuy = await res_buy.findOne({ _id: object_id });
        const resFlat = await res_flat.findOne({ _id: object_id });
        const comRent = await com_rent.findOne({ _id: object_id });
        const comBuy = await com_buy.findOne({ _id: object_id });
        const landBuy = await land_buy.findOne({ _id: object_id });
        const landDev = await land_dev.findOne({ _id: object_id });

        if(resRent) {
            const owner = await seller.findOne({ _id: resRent.ownerId });
            const Reviews = await reviews.findOne({ propertyId: object_id }) || [];
            const len = Reviews.userId.length;
            var users = [];
            for(var i=0; i<len; i++)
            {
                users[i] = await seller.findOne({ _id: Reviews.userId[i] });
            }

            res.status(200).json({ property: resRent, owner: owner, reviews: Reviews, users: users, len: len, propertyType: 'residential', adType: 'rent' });
        }
        else if(resBuy) {
            const owner = await seller.findOne({ _id: resBuy.ownerId });
            const Reviews = await reviews.findOne({ propertyId: object_id }) || [];
            const len = Reviews.userId.length;
            var users = [];
            for(var i=0; i<len; i++)
            {
                users[i] = await seller.findOne({ _id: Reviews.userId[i] });
            }

            res.status(200).json({ property: resBuy, owner: owner, reviews: Reviews, users: users, len: len, propertyType: 'residential', adType: 'buy' });
        }
        else if(resFlat) {
            const owner = await seller.findOne({ _id: resFlat.ownerId });
            const Reviews = await reviews.findOne({ propertyId: object_id }) || [];
            const len = Reviews.userId.length;
            var users = [];
            for(var i=0; i<len; i++)
            {
                users[i] = await seller.findOne({ _id: Reviews.userId[i] });
            }

            res.status(200).json({ property: resFlat, owner: owner, reviews: Reviews, users: users, len: len, propertyType: 'residential', adType: 'flatmates' });
        }
        else if(comRent) {
            const owner = await seller.findOne({ _id: comRent.ownerId });
            const Reviews = await reviews.findOne({ propertyId: object_id }) || [];
            const len = Reviews.userId.length;
            var users = [];
            for(var i=0; i<len; i++)
            {
                users[i] = await seller.findOne({ _id: Reviews.userId[i] });
            }
            res.status(200).json({ property: comRent, owner: owner, reviews: Reviews, users: users, len: len, propertyType: 'commercial', adType: 'rent' });
        }
        else if(comBuy) {
            const owner = await seller.findOne({ _id: comBuy.ownerId });
            const Reviews = await reviews.findOne({ propertyId: object_id }) || [];
            const len = Reviews.userId.length;
            var users = [];
            for(var i=0; i<len; i++)
            {
                users[i] = await seller.findOne({ _id: Reviews.userId[i] });
            }

            res.status(200).json({ property: comBuy, owner: owner, reviews: Reviews, users: users, len: len, propertyType: 'commercial', adType: 'buy' });
        }
        else if(landBuy) {
            const owner = await seller.findOne({ _id: landBuy.ownerId });
            const Reviews = await reviews.findOne({ propertyId: object_id }) || [];
            const len = Reviews.userId.length;
            var users = [];
            for(var i=0; i<len; i++)
            {
                users[i] = await seller.findOne({ _id: Reviews.userId[i] });
            }

            res.status(200).json({ property: landBuy, owner: owner, reviews: Reviews, users: users, len: len, propertyType: 'plot', adType: 'buy' });
        }
        else if(landDev) {
            const owner = await seller.findOne({ _id: landDev.ownerId });
            const Reviews = await reviews.findOne({ propertyId: object_id }) || [];
            const len = Reviews.userId.length;
            var users = [];
            for(var i=0; i<len; i++)
            {
                users[i] = await seller.findOne({ _id: Reviews.userId[i] });
            }

            res.status(200).json({ property: landDev, owner: owner, reviews: Reviews, users: users, len: len, propertyType: 'plot', adType: 'development' });
        }
    }
    catch(error){
        console.error(error);
        res.status(401).json({ error: 'Something went wrong' });
    }
}