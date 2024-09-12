const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require("path");
const cors = require("cors");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const app = express();
const port = 5000;


mongoose.connect('mongodb://localhost:27017/DreamSpaces2');

const Signup = require('./models/Signup');

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.json());


// app.use(express.static(path.join(__dirname, 'd-frontend/build')));

const registration = require('./controllers/Registration');


// Configure Passport with local strategy
passport.use('local_userLogin',new LocalStrategy({usernameField:"email",passwordField:"password"},
    async function (email, password, done, err) {
      // Find user by username and verify password
      const user = await Signup.findOne({ email: email });
        //if (err) { return done(err); }
        if (!user) { return done(null, false); }
        const match = await bcrypt.compare(password, user.password);
        if (!match) { return done(null, false); }
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async function(id, done) {
    const user =  await Signup.findOne({_id: id});
    done(null, user);

});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'd-frontend/build', 'index.html'));
// });

app.post('/api/register', registration.register);
app.post('/api/login', (req, res, next) => {
    passport.authenticate('local_userLogin', (err, user, info) => {
        if (err) {
            return res.status(400).json({ error: 'An error occurred' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Wrong Credentials' });
        }
        // Log the user in
        req.logIn(user, (err) => {
            if (err) {
                return res.status(400).json({ error: 'Login failed' });
            }
            // Send success response instead of redirecting
            return res.status(201).json({ message: 'Login Successful' });
        });
    })(req, res, next);
});



function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
}

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})