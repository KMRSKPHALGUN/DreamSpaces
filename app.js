const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require("path");
const cors = require("cors");
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const port = 5000;


mongoose.connect('mongodb://localhost:27017/DreamSpaces2');
const mongoStore = MongoStore.create({mongoUrl: 'mongodb://localhost:27017/DreamSpaces2', collectionName: 'sessions'});

app.use(bodyParser.json());

// app.use(session({ secret: 'secret', resave: false, saveUninitialized: false, store: mongoStore, cookie: { secure: false, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 } }));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(cors({
    origin: 'http://localhost:3000',  // Your frontend URL
    credentials: true                 // Allow sending credentials (cookies)
}));

// app.use((req, res, next) => {
//     console.log('Cookies:', req.cookies); // Log cookies
//     console.log('Session:', req.session); // Log session
//     console.log('User data from session (req.session.user):', req.session.user);
//     next();
// });
  


// app.use(express.static(path.join(__dirname, 'd-frontend/build')));

const Signup = require('./models/Signup');
const registration = require('./controllers/Registration');
const Commercialrent = require('./controllers/Commercial_rent');

// // Configure Passport with local strategy
// passport.use('local_userLogin',new LocalStrategy({usernameField:"email",passwordField:"password"},
//     async function (email, password, done, err) {
//       // Find user by username and verify password
//       const user = await Signup.findOne({ email: email });
//         //if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         const match = await bcrypt.compare(password, user.password);
//         if (!match) { return done(null, false); }
//         return done(null, user);
//     }
// ));

// passport.serializeUser(function(user, done) {
//     console.log('Serializing user:', user._id);
//     done(null, user._id);
// });

// // Deserialize user from session
// passport.deserializeUser(async function(id, done) {
//     try
//     {
//         console.log('Deserializing User with ID:', id);
//         const user = await Signup.findOne({_id: id});
//         if (user) {
//             console.log('User found during deserialization:', user);
//         } else {
//             console.log('No user found during deserialization');
//         }
//         done(null, user);
//     }
//     catch (error)
//     {
//         console.log("inside catch of deserializer");
//         done(error, null);
//     }
// });


const ds=multer.diskStorage({
    destination: "./public/uploads",
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