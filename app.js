const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const os = require('os');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');

const app = express();
const port = 5000;


mongoose.connect('mongodb://localhost:27017/DreamSpaces2');
const mongoStore = MongoStore.create({mongoUrl: 'mongodb://localhost:27017/DreamSpaces2', collectionName: 'sessions'});

app.use(bodyParser.json());
app.use(helmet());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


// Allow all origins
app.use(cors({
    origin: '*'
}));

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
    definition:{
        openapi:'3.0.0',
        info:{
            title:'DreamSpaces API Documentation',
            version:'1.0.0'
        },
        servers:[{
            url: 'http://localhost:5000',
            description: 'Local Server'
        }]
    },

    apis: ['./app.js']
}

const swaggerspec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerspec))

// Set up HTTPS server options
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

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

    socket.on("toggleVideo", ({ to, isVideoOn }) => {
        const connectedClients = Array.from(io.sockets.sockets.values());
        connectedClients.forEach(client => {
            if(client.userId === to)
            {
                client.emit("peerVideoToggle", { isVideoOn });
            }
        })
    });

    socket.on("toggleMic", ({ to, isMicOn }) => {
        const connectedClients = Array.from(io.sockets.sockets.values());
        connectedClients.forEach(client => {
            if(client.userId === to)
            {
                client.emit("peerMicToggle", { isMicOn });
            }
        })
    });

    socket.on("endCall", ({ to }) => {
        const connectedClients = Array.from(io.sockets.sockets.values());
        connectedClients.forEach(client => {
            if(client.userId === to)
            {
                client.emit("endCall", {
                    message: "endCall"
                })
            }
        })
    })
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
const { title } = require('process');


const ds=multer.diskStorage({
    destination: "./d-frontend/public/uploads",
    filename:(req,file,cb)=>{
        cb(null, req.userId+""+file.originalname.replaceAll(' ', ''));
    }
});

const upload = multer({storage: ds});


// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'd-frontend/build', 'index.html'));
// });

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: './models/Signup'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
app.post('/api/register', Registration.register);

/**
 * @swagger
 * /api/verifyUser:
 *   post:
 *     summary: Verify user details through otp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OTP sent successfully
 *       '500':
 *         description: Failed to send OTP
 */
app.post('/api/verifyUser', Registration.verifyUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login successful, returns token
 *       '401':
 *         description: Unauthorized - Incorrect credentials
 *       '500':
 *         description: Login Failed
 */
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Signup.findOne({ email: email });
        if (!user) {
        return res.status(401).json({ error: 'User Not Found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        return res.status(401).json({ error: 'Wrong Password' });
        }
        const token = jwt.sign({ userId: user._id }, 'DreamSpacesSecret', {
        expiresIn: '1h',
        });
        res.status(200).json({ token: token, client: user, message: 'Login Successful' });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * @swagger
 * /api/adminLogin:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login successful, returns token
 *       '401':
 *         description: Unauthorized - Incorrect credentials
 *       '500':
 *         description: Login Failed
 */
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

/**
 * @swagger
 * /api/property_listings:
 *   post:
 *     summary: Get property listings based on filters
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *               property_type:
 *                 type: string
 *                 enum: ["residential", "commercial", "land"]
 *               ad_type:
 *                 oneOf:
 *                    - type: string
 *                      enum: ["rent", "buy", "flatmates"]
 *                      description: "Allowed only when property_type is residential"
 *                    - type: string
 *                      enum: ["rent", "buy"]
 *                      description: "Allowed only when property_type is commercial"
 *                    - type: string
 *                      enum: ["buy", "development"]
 *                      description: "Allowed only when property_type is land"
 *     responses:
 *       '201':
 *         description: Returns property listings and their owners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 properties:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - "$ref": "./models/ResidentialRent.js"
 *                       - $ref: "./models/ResidentialSale.js"
 *                       - $ref: "./models/ResidentialFlatmates.js"
 *                       - $ref: "./models/CommercialRent.js"
 *                       - $ref: "./models/CommercialSale.js"
 *                       - $ref: "./models/PlotSale.js"
 *                       - $ref: "./models/PlotDev.js"
 *                 owners:
 *                   type: array
 *                   items:
 *                     $ref: "./models/Signup.js"
 *       '400':
 *         description: Invalid request data
 *       '401':
 *         description: Unauthorized - Invalid or missing token
 */
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
        console.log("HI");
        const networkInterfaces = os.networkInterfaces();
        for (const interfaceName in networkInterfaces)
        {
            if(interfaceName.toLowerCase().includes('wi-fi') || interfaceName.toLowerCase().includes('wlan') || interfaceName.toLowerCase().includes('wifi'))
            {
                const interfaces = networkInterfaces[interfaceName];
                for (const iface of interfaces)
                {
                    if(iface.family === 'IPv4' && !iface.internal)
                    {
                        console.log(iface.address);
                        return res.status(200).json({ localhost: `${iface.address}` });
                    }
                }
            }
        }
    }
    catch(error)
    {
        res.status(500).json({ localhost: '10.0.49.77' });
    }
});

app.get('/api/userDetails', verifyToken, UserDetails.userDetails);

app.get('/api/adminDashboard', verifyToken, AdminDashboard.getAdminDashboard);

app.get('/api/adminCheck', async (req, res) => {
	try {
			let token = req.header('Authorization');
			if (!token) {
				return res.status(401).json({ error: 'Access denied. No token provided.' });
			}

			if (token.startsWith('Bearer ')) {
				token = token.slice(7).trim(); // Remove 'Bearer ' prefix
			}

			let decoded;
			try {
				decoded = jwt.verify(token, 'DreamSpacesSecret');
			} catch (err) {
				return res.status(403).json({ error: 'Invalid or expired token' });
			}

			const exAdmin = await Admin.findOne({ _id: decoded.userId });
			if (!exAdmin) {
				return res.status(404).json({ error: 'Admin not found' });
			}

			return res.status(200).json({ message: 'yes' });

	} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server error' });
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

app.listen(5000, () => console.log(`Server is running on http://localhost:${port}`))