const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const endUsers = require('../models/Signup');

exports.update = async(req,res) => {
    try{
        const {name, email, phone, bio, motive, image} = req.body;
        const imagePaths = req.files.map(file => file.path.slice(18, file.path.length));
        await endUsers.findOneAndUpdate({_id: req.userId}, {$set: { name: name, email: email, phone: phone, bio: bio, profile_pic: imagePaths[0], motive: motive }});
        res.status(200).json({ message: 'Details Updated Successfully' });
    }
    catch(error) {
        console.log(error);
        res.status(401).json({error: 'Something went wrong'});
    }
}

exports.changePassword = async(req,res) => {
    try {
        const {inputPasswordCurrent, inputPasswordNew, inputPasswordNew2} = req.body;
        const client = await endUsers.findOne({_id: req.userId});
        const match = await bcrypt.compare(inputPasswordCurrent, client.password);
        if(match) {
            if(inputPasswordNew === inputPasswordNew2) {
                const hashedPassword = await bcrypt.hash(inputPasswordNew, 10);
                await endUsers.updateOne({_id: client._id}, {$set:{password: hashedPassword}});
                res.status(200).json({message: 'Password Updated Successfully'});
            }
            else {
                res.status(401).json({ error: 'New Password and Verify Pssword did not match' });
            }
        }
        else {
            res.status(401).json({ error: 'Current Passowrd is wrong' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server error' });
    }
}