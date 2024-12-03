// Import necessary modules
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Signup = require('../models/Signup');
const nodemailer = require('nodemailer');
const NodeCache = require('node-cache');
const twilio = require('twilio');
const crypto = require('crypto'); // For generating OTP
require('dotenv').config();

const otpCache = new NodeCache({ stdTTL: 300 });

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NODE_MAILER_USER, // Replace with your email
        pass: process.env.NODE_MAILER_PASS   // Replace with your email password or app-specific password
    }
});


// Twilio credentials from your Twilio account
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);


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

// Function to generate random 6-digit OTP
function generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
}

// Handle user registration
exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, otpEmail, otpPhone } = req.body;

        const cachedOtpEmail = otpCache.get(email);
        const cachedOtpPhone = otpCache.get(phone);

        if (cachedOtpEmail === otpEmail && cachedOtpPhone === otpPhone) {
            // OTP is correct, proceed with user registration
            otpCache.del(email); // Clear OTP after successful verification
            otpCache.del(phone)

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


exports.verifyUser = async(req, res) => {
    const { email, phone } = req.body;
    try
    {
        const existingEmail = await Signup.findOne({ email: email });
        if(existingEmail)
        {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }
        const existingPhone = await Signup.findOne({ phone: phone });
        if(existingPhone)
        {
            return res.status(409).json({ success: false, message: "Phone Number already exists" });
        }
        // Generate a 6-digit OTP
        const otpEmail = generateOtp();
        const otpPhone = generateOtp();

        // Store OTP in cache with the email as the key
        otpCache.set(email, otpEmail);
        otpCache.set(phone, otpPhone);

        // Email message configuration
        const mailOptions = {
            from: process.env.NODE_MAILER_USER, // Sender address
            to: email,                    // Recipient address
            subject: 'Registration into DreamSpaces',
            text: `Your DreamSpaces Verification Code is ${otpEmail}. It will expire in 5 minutes.`
        };
        // Send the email
    
        // Send OTP via Twilio SMS
        await twilioClient.messages.create({
            body: `Your DreamSpaces Verification Code is ${otpPhone}. It will expire in 5 minutes.`,
            from: '+12088377815',
            to: `+91${phone}`,
        });
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
}