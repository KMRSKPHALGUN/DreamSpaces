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

const AdminSchema = require("./schemas/Admin.json");
const CommercialRentSchema = require("./schemas/CommercialRent.json");
const CommercialSaleSchema = require("./schemas/CommercialSale.json");
const PlotDevSchema = require("./schemas/PlotDev.json");
const PlotSaleSchema = require("./schemas/PlotSale.json");
const ReportsSchema = require("./schemas/Reports.json");
const ResidentialFlatmatesSchema = require("./schemas/ResidentialFlatmates.json");
const ResidentialRentSchema = require("./schemas/ResidentialRent.json");
const ResidentialSaleSchema = require("./schemas/ResidentialSale.json");
const ReviewsSchema = require("./schemas/Reviews.json");
const SignupSchema = require("./schemas/Signup.json");

const swaggerOptions = {
    definition:{
        openapi:'3.0.0',
        info:{
            title:'DreamSpaces API Documentation',
            version:'1.0.0'
        },
        components: {
            schemas: {
                Admin: AdminSchema,
                CommercialRent: CommercialRentSchema,
                CommercialSale: CommercialSaleSchema,
                PlotDev: PlotDevSchema,
                PlotSale: PlotSaleSchema,
                Reports: ReportsSchema,
                ResidentialFlatmates: ResidentialFlatmatesSchema,
                ResidentialRent: ResidentialRentSchema,
                ResidentialSale: ResidentialSaleSchema,
                Reviews: ReviewsSchema,
                Signup: SignupSchema
            }
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
// const options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
// };

// const server = https.createServer(options, app);
// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "*",
// 		methods: [ "GET", "POST" ]
// 	}
// })

// io.on("connection", (socket) => {
//     socket.on("initialize", (userId) => {
//         socket.userId = userId;
//     });

// 	socket.emit("me", socket.userId);

// 	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	});

// 	socket.on("callUser", (data) => {
//         const connectedClients = Array.from(io.sockets.sockets.values());
//         connectedClients.forEach(client => {
//             if(client.userId === data.userToCall)
//             {
//                 client.emit("callUser", {
//                     signal: data.signalData,
//                     from: data.from,
//                     to: data.userToCall,
//                     name: data.name
//                 })
//             }
//         })
// 	});

//     socket.on("call-accepted", (data) => {
//         const connectedClients = Array.from(io.sockets.sockets.values());
//         connectedClients.forEach(client => {
//             if(client.userId === data.to)
//             {
//                 client.emit("call-accepted", {
//                     signal: data.signal,
//                     from: data.from,
//                     to: data.to,
//                     name: data.name
//                 })
//             }
//         })
// 	});

// 	socket.on("answerCall", (data) => {
//         const connectedClients = Array.from(io.sockets.sockets.values());
//         connectedClients.forEach(client => {
//             if(client.userId === data.to)
//             {
//                 client.emit("callAccepted", {
//                     signal: data.signal
//                 })
//             }
//         })
// 	});

//     socket.on("toggleVideo", ({ to, isVideoOn }) => {
//         const connectedClients = Array.from(io.sockets.sockets.values());
//         connectedClients.forEach(client => {
//             if(client.userId === to)
//             {
//                 client.emit("peerVideoToggle", { isVideoOn });
//             }
//         })
//     });

//     socket.on("toggleMic", ({ to, isMicOn }) => {
//         const connectedClients = Array.from(io.sockets.sockets.values());
//         connectedClients.forEach(client => {
//             if(client.userId === to)
//             {
//                 client.emit("peerMicToggle", { isMicOn });
//             }
//         })
//     });

//     socket.on("endCall", ({ to }) => {
//         const connectedClients = Array.from(io.sockets.sockets.values());
//         connectedClients.forEach(client => {
//             if(client.userId === to)
//             {
//                 client.emit("endCall", {
//                     message: "endCall"
//                 })
//             }
//         })
//     })
// })



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
 *             $ref: '#/components/schemas/Signup'
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

/**
 * @swagger
 * /api/residential_rent:
 *   post:
 *     summary: Post a new Residential Rental property
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResidentialRent'
 *     responses:
 *       201:
 *         description: Property listed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
app.post('/api/residential_rent', verifyToken, upload.array("image", 10), Residentialrent.residentialRent);


/**
 * @swagger
 * /api/commercial_rent:
 *   post:
 *     summary: Post a new Commercial Rental property
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommercialRent'
 *     responses:
 *       201:
 *         description: Property listed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
app.post('/api/commercial_rent', verifyToken, upload.array("image", 10), Commercialrent.commercialRent);

/**
 * @swagger
 * /api/commercial_sale:
 *   post:
 *     summary: Post a new Commercial Sale property
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommercialSale'
 *     responses:
 *       201:
 *         description: Property listed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
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
 *                       - $ref: "#/components/schemas/ResidentialRent"
 *                       - $ref: "#/components/schemas/ResidentialSale"
 *                       - $ref: "#/components/schemas/ResidentialFlatmates"
 *                       - $ref: "#/components/schemas/CommercialRent"
 *                       - $ref: "#/components/schemas/CommercialSale"
 *                       - $ref: "#/components/schemas/PlotSale"
 *                       - $ref: "#/components/schemas/PlotDev"
 *                 owners:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Signup"
 *       '400':
 *         description: Invalid request data
 *       '401':
 *         description: Unauthorized - Invalid or missing token
 */
app.post('/api/property_listings', verifyToken, PropertyListings.property_listings);

/**
 * @swagger
 * /api/updateMyDetails:
 *   post:
 *     summary: Update details of logged-in uer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Signup'
 *     responses:
 *       200:
 *         description: Details updated successfully
 *       401:
 *         description: Something went wrong
 */
app.post('/api/updateMyDetails', verifyToken, upload.array("image", 1), UpdateMyDetails.update);

/**
 * @swagger
 * /api/changePassword:
 *   post:
 *     summary: Change logged-in user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inputPasswordCurrent:
 *                 type: string
 *                 example: "securePassword123"
 *               inputPasswordNew:
 *                 type: string
 *                 example: "securePassword123"
 *               inputPasswordNew2:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Password Updated Successfully
 *       401:
 *         description: New Password and Verify Pssword did not match / Current Passowrd is wrong
 *       500:
 *         description: Internal Server Error
 */
app.post('/api/changePassword', verifyToken, UpdateMyDetails.changePassword);

/**
 * @swagger
 * /api/makeAdmin:
 *   post:
 *     summary: Make Admin a particular user
 *     security:
 *       - bearerAuth: []
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
 *       200:
 *         description: User made as Admin successfully / Already an Admin
 *       500:
 *         description: Internal Server Error
 */
app.post('/api/makeAdmin', verifyToken, AdminDashboard.makeAdmin);

/**
 * @swagger
 * /api/deleteUser:
 *   post:
 *     summary: Delete a particular user
 *     security:
 *       - bearerAuth: []
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
 *       200:
 *         description: User and his Properties are deleted successfully
 *       500:
 *         description: Internal Server Error
 */
app.post('/api/deleteUser', verifyToken, AdminDashboard.deleteUser);

/**
 * @swagger
 * /api/deleteAccount:
 *   post:
 *     summary: Delete the logged-in user's account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Account deleted permanently
 *       401:
 *         description: Current password is wrong
 *       500:
 *         description: Internal Server Error
 */
app.post('/api/deleteAccount', verifyToken, UserDetails.deleteAccount);

/**
 * @swagger
 * /api/deleteProperty:
 *   post:
 *     summary: Delete a property
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: "609e129e834f1c001f57b2a1"
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       500:
 *         description: Internal Servor Error
 */
app.post('/api/deleteProperty', verifyToken, UserDetails.deleteProperty);

/**
 * @swagger
 * /api/viewProperty:
 *   post:
 *     summary: Get details of a specific property
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: "609e129e834f1c001f57b2a1"
 *     responses:
 *       '200':
 *         description: Returns property details and owner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 properties:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - $ref: "#/components/schemas/ResidentialRent"
 *                       - $ref: "#/components/schemas/ResidentialSale"
 *                       - $ref: "#/components/schemas/ResidentialFlatmates"
 *                       - $ref: "#/components/schemas/CommercialRent"
 *                       - $ref: "#/components/schemas/CommercialSale"
 *                       - $ref: "#/components/schemas/PlotSale"
 *                       - $ref: "#/components/schemas/PlotDev"
 *                 owner:
 *                     $ref: "#/components/schemas/Signup"
 *                 client:
 *                     $ref: "#/components/schemas/Signup"
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Reviews"
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Signup"
 *                 property_type:
 *                   type: string
 *                   enum: ["residential", "commercial", "land"]
 *                 ad_type:
 *                   oneOf:
 *                      - type: string
 *                        enum: ["rent", "buy", "flatmates"]
 *                        description: "Allowed only when property_type is residential"
 *                      - type: string
 *                        enum: ["rent", "buy"]
 *                        description: "Allowed only when property_type is commercial"
 *                      - type: string
 *                        enum: ["buy", "development"]
 *                        description: "Allowed only when property_type is land"
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
app.post('/api/viewProperty', verifyToken, PropertyDetails.viewProperty);

/**
 * @swagger
 * /api/saveProperty:
 *   post:
 *     summary: Save a property to user's saved list
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: "609e129e834f1c001f57b2a1"
 *     responses:
 *       200:
 *         description: Property saved successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
app.post('/api/saveProperty', verifyToken, SaveProperty.save_property);

/**
 * @swagger
 * /api/reportProperty:
 *   post:
 *     summary: Report a property for issues
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: "609e129e834f1c001f57b2a1"
 *               reason:
 *                 type: string
 *                 example: "Spam or misleading listing"
 *     responses:
 *       200:
 *         description: Report submitted successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
app.post('/api/reportProperty', verifyToken, Report.reports);

/**
 * @swagger
 * /api/reviewProperty:
 *   post:
 *     summary: Report a property for issues
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: "609e129e834f1c001f57b2a1"
 *               comment:
 *                 type: string
 *                 example: "Nice House"
 *     responses:
 *       200:
 *         description: Report submitted successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/userDetails:
 *   get:
 *     summary: Get user details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *       401:
 *         description: Unauthorized
 */
app.get('/api/userDetails', verifyToken, UserDetails.userDetails);

/**
 * @swagger
 * /api/adminDashboard:
 *   get:
 *     summary: Get data for Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 properties:
 *                   type: array
 *                   items:
 *                       - $ref: "#/components/schemas/ResidentialRent"
 *                       - $ref: "#/components/schemas/ResidentialSale"
 *                       - $ref: "#/components/schemas/ResidentialFlatmates"
 *                       - $ref: "#/components/schemas/CommercialRent"
 *                       - $ref: "#/components/schemas/CommercialSale"
 *                       - $ref: "#/components/schemas/PlotSale"
 *                       - $ref: "#/components/schemas/PlotDev"
 *                 owner:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Signup"
 *                 reports:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Reports"
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Signup"
 *       500:
 *         description: Internal Server Error
 */
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
    if (!token) {
        console.log("No Token(in verifyToken)");
        return res.status(401).json({ error: 'Access denied' });
    }
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

module.exports = app;

if (require.main === module) {
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  }