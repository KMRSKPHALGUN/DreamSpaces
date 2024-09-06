const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String },
    profile_pic: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    motive: { type: String },
    savedProperties: { type: [String] },
    postedProperties: { type: [String] }
});

module.exports = mongoose.model('Signup', signupSchema);
