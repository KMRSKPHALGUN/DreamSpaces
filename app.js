const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require("path");
const cors = require("cors");
const session = require('express-session');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const port = 5000;


mongoose.connect('mongodb://localhost:27017/DreamSpaces2');
const mongoStore = MongoStore.create({mongoUrl: 'mongodb://localhost:27017/DreamSpaces2', collectionName: 'sessions'});

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000',  // Your frontend URL
    credentials: true                 // Allow sending credentials (cookies)
}));



// app.use(express.static(path.join(__dirname, 'd-frontend/build')));

const Signup = require('./models/Signup');
const registration = require('./controllers/Registration');
const Commercialrent = require('./controllers/Commercial_rent');
const PropertyListings = require('./controllers/Property_Listings');
const UserDetails = require('./controllers/UserDetails');


const ds=multer.diskStorage({
    destination: "./d-frontend/public/uploads",
    filename:(req,file,cb)=>{

        cb(null, req.userId+"_"+file.originalname);
    }
});

const upload = multer({storage: ds});


// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'd-frontend/build', 'index.html'));
// });

app.post('/api/register', registration.register);
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Signup.findOne({ email: email });
        if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, 'DreamSpacesSecret', {
        expiresIn: '1h',
        });
        res.status(200).json({ token, message: 'Login Successful' });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});


app.post('/api/commercial_rent', verifyToken, upload.array("image", 10), Commercialrent.commercialRent);

app.post('/api/property_listings', verifyToken, PropertyListings.property_listings);

app.get('/api/userDetails', verifyToken, UserDetails.userDetails);

function verifyToken(req, res, next) {
    let token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trim(); // Remove 'Bearer ' prefix
    }
    try {
        const decoded = jwt.verify(token, 'DreamSpacesSecret');
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
// function isAuthenticated(req, res, next) {
//     console.log('Session:', req.session);      // Log session info
//     console.log('User:', req.user);            // Log the user info
//     console.log('Authenticated:', req.isAuthenticated());  // Log the authentication status
    
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.status(401).json({ error: 'User not authenticated' });
// }

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})