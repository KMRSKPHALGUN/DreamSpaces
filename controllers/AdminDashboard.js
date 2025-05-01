const Report = require('../models/Reports');
const res_rent = require('../models/ResidentialRent');
const res_buy = require('../models/ResidentialSale');
const res_flat = require('../models/ResidentialFlatmates');
const com_rent = require('../models/CommercialRent');
const com_buy = require('../models/CommercialSale');
const land_buy = require('../models/PlotSale');
const land_dev = require('../models/PlotDev');
const Signup = require('../models/Signup');
const Admin = require('../models/Admin');


exports.getAdminDashboard = async (req, res) => {
    try {
        // Fetch all users and reports from the database
        const users = await Signup.find({});
        const reports = await Report.find({});
        
        var property = [];
        property = property.concat(await res_rent.find({}));
        property = property.concat(await res_buy.find({}));
        property = property.concat(await res_flat.find({}));
        property = property.concat(await com_buy.find({}));
        property = property.concat(await com_rent.find({}));
        property = property.concat(await land_buy.find({}));
        property = property.concat(await land_dev.find({}));
        const len = property.length;
        const owner = [];
        for (let i = 0; i < len; i++) {
            owner[i] = await Signup.findOne({ _id: property[i].ownerId });
        }

        // Render the admin dashboard view with users, reports, and property data
        res.status(200).json({ users: users, reports: reports, properties: property, len: len, owners: owner });
    } catch (error) {
        console.error('Error fetching data:', error);
         res.status(401).json({error: 'Something went wrong'});
    }
};

exports.deleteUser = async(req,res)=>{
    try {
        const email = req.body.u_email;
        const client = await Signup.findOne({ email: email });
        await res_rent.deleteMany({ownerId: client._id});
        await res_buy.deleteMany({ownerId: client._id});
        await res_flat.deleteMany({ownerId: client._id});
        await com_buy.deleteMany({ownerId: client._id});
        await com_rent.deleteMany({ownerId: client._id});
        await land_buy.deleteMany({ownerId: client._id});
        await land_dev.deleteMany({ownerId: client._id});
        await Signup.deleteOne({_id: client._id});
        res.status(200).json({message: 'User and his Properties are deleted successfully'});
    }
    catch(error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
    
}


exports.makeAdmin = async(req,res)=> {
    try {
        const { useremail } = req.body;
        if(! await Admin.findOne({email: useremail}))
        {
            const client = await Signup.findOne({email: useremail});
            const newAdmin = new Admin({
                name: client.name,
                email: client.email,
                password: client.password,
                phone: client.phone
            });
            await newAdmin.save();
            res.status(200).json({message: 'User made as Admin successfully'});
        }
        else
        {
            res.status(200).json({message: 'Already an Admin'});
        }
    }
    catch(error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}