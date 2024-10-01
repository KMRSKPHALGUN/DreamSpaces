// Import necessary modules
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Signup = require('../models/Signup');
const nodemailer = require('nodemailer');
const NodeCache = require('node-cache');

const otpCache = new NodeCache({ stdTTL: 300 });

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'phalgunkothamasu@gmail.com', // Replace with your email
        pass: 'zirgtcnqvwkhdbxd'   // Replace with your email password or app-specific password
    }
});

// Handle user login
// exports.login = async (req, res) => {
//     try {
//         const { l_email, l_password } = req.body;

//         // Validate email format
//         if (!validateEmail(l_email)) {
//             return res.render('error', { error: 'Invalid email format' });
//         }

//         const existingUser = await Signup.findOne({ email: l_email });
//         if (!existingUser) {
//             return res.render('error', { error: 'Email does not exist' });
//         }

//         // Compare hashed password with password entered by user
//         const match = await bcrypt.compare(l_password, existingUser.password);
//         if (!match) {
//             return res.render('error', { error: 'Wrong password' });
//         }

//         // Redirect to homepage upon successful login
//         res.render('index');
//     } catch (error) {
//         console.error(error);
//         res.render('error', { error: 'Something went wrong' });
//     }
// }

// Validate email format
function validateEmail(email) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const domain = "gmail.com";
    const domainLength = domain.length;
    
    const atIndex = email.indexOf('@');
    const domainIndex = email.indexOf(domain);
    
    return atIndex !== -1 && atIndex < domainIndex && domainIndex === email.length - domainLength;
}
// Phone number validation function
function validatePhone(phone) {
    return phone.length === 10; 
}
// Handle user registration
exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, otp } = req.body;

        const cachedOtp = otpCache.get(email);

        if (cachedOtp && cachedOtp === otp) {
            // OTP is correct, proceed with user registration
            otpCache.del(email); // Clear OTP after successful verification

            // Check if email format is valid
            if (!validateEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Check if phone number length is valid
            if (!validatePhone(phone)) {
                return res.status(400).json({ error: 'Invalid phone number' });
            }

            // Check if email already exists
            const existingUser = await Signup.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            // Check if phone number already exists
            const existingPhone = await Signup.findOne({ phone });
            if (existingPhone) {
                return res.status(400).json({ error: 'Phone number already exists' });
            }

            // Check if password and confirm password match
            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords do not match' });
            }

            if(password.length < 6) {
                return res.status(400).json({ error: 'Passoword is too short. It must contain atleast 6 characters.' });
            }
            // Hash password before saving to database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user with hashed password
            const newUser = new Signup({
                name,
                email,
                password: hashedPassword,
                phone
            });
            await newUser.save();            
            res.status(200).json({ success: true, message: 'Registration Successful' });
        } else {
            // OTP is incorrect or expired
            res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}


exports.verifyEmail = async(req, res) => {
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in cache with the email as the key
    otpCache.set(email, otp);

    // Email message configuration
    const mailOptions = {
        from: 'your-email@gmail.com', // Sender address
        to: email,                    // Recipient address
        subject: 'Your OTP for Registration',
        text: `Your OTP for registration is ${otp}. It will expire in 5 minutes.`
    };
    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
}