const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require("path");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/DreamSpaces2');

app.use(express.static(path.join(__dirname, 'd-frontend/build')));

const registration = require('./controllers/Registration');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'd-frontend/build', 'index.html'));
});

app.post('/api/register', registration.register);

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})