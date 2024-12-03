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
const WebSocket = require('ws');
const os = require('os');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 5000;


mongoose.connect('mongodb://localhost:27017/DreamSpaces2');
const mongoStore = MongoStore.create({mongoUrl: 'mongodb://localhost:27017/DreamSpaces2', collectionName: 'sessions'});

app.use(bodyParser.json());

// Allow all origins
app.use(cors({
    origin: '*'
}));

// Set up HTTPS server options
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const http = require("http")
const server = https.createServer(options, app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
})

io.on("connection", (socket) => {
    socket.on("initialize", (userId) => {
        socket.userId = userId;
    });

	socket.emit("me", socket.userId);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", (data) => {
        const connectedClients = Array.from(io.sockets.sockets.values());
        connectedClients.forEach(client => {
            if(client.userId === data.userToCall)
            {
                client.emit("callUser", {
                    signal: data.signalData,
                    from: data.from,
                    to: data.userToCall,
                    name: data.name
                })
            }
        })
	});

    socket.on("call-accepted", (data) => {
        const connectedClients = Array.from(io.sockets.sockets.values());
        connectedClients.forEach(client => {
            if(client.userId === data.to)
            {
                client.emit("call-accepted", {
                    signal: data.signal,
                    from: data.from,
                    to: data.to,
                    name: data.name
                })
            }
        })
	});

	socket.on("answerCall", (data) => {
        const connectedClients = Array.from(io.sockets.sockets.values());
        connectedClients.forEach(client => {
            if(client.userId === data.to)
            {
                client.emit("callAccepted", {
                    signal: data.signal
                })
            }
        })
	});
})



// app.use(express.static(path.join(__dirname, 'd-frontend/build')));

const Signup = require('./models/Signup');
const Admin = require('./models/Admin');
const Registration = require('./controllers/Registration');
const Residentialrent = require('./controllers/Residential_rent');
const Commercialrent = require('./controllers/Commercial_rent');
const Commercialsale = require('./controllers/Commercial_sale');
const PropertyListings = require('./controllers/Property_Listings');
const UserDetails = require('./controllers/UserDetails');
const UpdateMyDetails = require('./controllers/UpdateMyDetails');
const AdminDashboard = require('./controllers/AdminDashboard');
const PropertyDetails = require('./controllers/PropertyDetails');
const SaveProperty = require('./controllers/SaveProperty');
const Report = require('./controllers/Report');
const Reviews = require('./controllers/Reviews');


const ds=multer.diskStorage({
    destination: "./d-frontend/public/uploads",
    filename:(req,file,cb)=>{
        cb(null, req.userId+"_"+file.originalname.replaceAll(' ', '_'));
    }
});

const upload = multer({storage: ds});


// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'd-frontend/build', 'index.html'));
// });

app.post('/api/register', Registration.register);

app.post('/api/verifyUser', Registration.verifyUser);

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
        res.status(200).json({ token: token, client: user, message: 'Login Successful' });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/adminLogin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }
        const token = jwt.sign({ userId: user._id }, 'DreamSpacesSecret', {
        expiresIn: '1h',
        });
        res.status(200).json({ token, message: 'Login Successful' });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/residential_rent', verifyToken, upload.array("image", 10), Residentialrent.residentialRent);

app.post('/api/commercial_rent', verifyToken, upload.array("image", 10), Commercialrent.commercialRent);

app.post('/api/commercial_sale', verifyToken, upload.array("image", 10), Commercialsale.commercialSale);

app.post('/api/property_listings', verifyToken, PropertyListings.property_listings);

app.post('/api/updateMyDetails', verifyToken, upload.array("image", 1), UpdateMyDetails.update);

app.post('/api/changePassword', verifyToken, UpdateMyDetails.changePassword);

app.post('/api/makeAdmin', verifyToken, AdminDashboard.makeAdmin);

app.post('/api/deleteUser', verifyToken, AdminDashboard.deleteUser);

app.post('/api/deleteAccount', verifyToken, UserDetails.deleteAccount);

app.post('/api/deleteProperty', verifyToken, UserDetails.deleteProperty);

app.post('/api/viewProperty', verifyToken, PropertyDetails.viewProperty);

app.post('/api/saveProperty', verifyToken, SaveProperty.save_property);

app.post('/api/reportProperty', verifyToken, Report.reports);

app.post('/api/reviewProperty', verifyToken, Reviews.review);

app.get('/api/getLocalHost', async(req, res) => {
    try
    {
        const networkInterfaces = os.networkInterfaces();
        for (const interfaceName in networkInterfaces)
        {
            const interfaces = networkInterfaces[interfaceName];
            for (const iface of interfaces)
            {
                if(iface.family === 'IPv4' && !iface.internal)
                {
                    return res.status(200).json({ localhost: `${iface.address}` });
                }
            }
        }
    }
    catch(error)
    {
        res.status(500).json({ localhostdefault: '10.0.48.153' });
    }
});

app.get('/api/userDetails', verifyToken, UserDetails.userDetails);

app.get('/api/adminDashboard', verifyToken, AdminDashboard.getAdminDashboard);

app.get('/api/adminCheck', async(req, res) => {
    try{
        let token = req.header('Authorization');
        if (!token) return res.status(401).json({ error: 'Access denied' });
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trim(); // Remove 'Bearer ' prefix
        }
        const decoded = jwt.verify(token, 'DreamSpacesSecret');
        const exAdmin = await Admin.findOne({ _id: decoded.userId});
        if(exAdmin) {
            res.status(200).json({ message: 'yes' });
        }
        else
        {
            res.status(200).json({ message: 'false' });
        }
    }
    catch(error)
    {
        res.status(401).json({ error: 'Invalid token' });
    }
});

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

server.listen(5000, () => console.log(`Server is running on https://localhost:${port}`))