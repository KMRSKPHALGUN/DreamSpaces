const mongoose = require('mongoose');
const seller = require('../models/Signup');
const reviews = require('../models/Reviews');

exports.review = async(req,res) => {
    try {
        const { comment_input, propertyId } = req.body;
        const existingReview = await reviews.findOne({propertyId: propertyId});
        if(existingReview) {
            existingReview.userId = existingReview.userId.concat(req.userId);
            const uniqueElements = new Set(existingReview.userId);
            if(uniqueElements.size !== existingReview.userId.length)
            {
                res.status(200).json({message2: 'You have already reviewed this property'});
            }
            else
            {
                const allReviews = await reviews.findOne({propertyId: propertyId});
                await reviews.updateOne({propertyId: propertyId},{$push: { userId: req.userId , comment_input: comment_input }});
                const Reviews = await reviews.findOne({propertyId: propertyId});
                const len = Reviews.userId.length;
                var users = [];
                for(var i=0; i<len; i++)
                {
                    users[i] = await seller.findOne({ _id: Reviews.userId[i] });
                }
                res.status(200).json({message: 'Property Reviewed Successfully', reviews: Reviews, users: users});
            }

        }
        else {
            const newReview = new reviews({
                comment_input,
                propertyId,
                userId: req.userId,
            });
            await newReview.save();
            const Reviews = await reviews.findOne({propertyId: propertyId});
            const len = Reviews.userId.length;
            var users = [];
            for(var i=0; i<len; i++)
            {
                users[i] = await seller.findOne({ _id: Reviews.userId[i] });
            }
            res.status(200).json({message: 'Property Reviewed Successfully', reviews: Reviews, users: users});
        }
        
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Something went wrong' });
    }
}