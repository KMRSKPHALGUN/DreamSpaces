const mongoose = require('mongoose');

const review = new mongoose.Schema({
    propertyId: { type: String, required: true },
    comment_input: { type: [String], required: true },
    userId: { type: [String], required: true }
});

module.exports = mongoose.model('Reviews', review);
