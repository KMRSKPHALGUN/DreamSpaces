const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const path = require('path');

const imagePath = path.join(__dirname, 'sample.jpg'); //resolves full path

// Replace this token with a real one or generate dynamically
let token;

const user = {
  name: 'Test User',
  email: 'testuser@gmail.com',
  password: 'testpassword',
  confirmPassword: 'testpassword',
  phone: '1234567890',
  otpEmail: '123456'
};

  

beforeAll(async () => {
  // Register the user
  const reg_res = await request(app).post('/api/register').send(user);

  // Login to get token
  const res = await request(app).post('/api/login').send({
    email: user.email,
    password: user.password
  });

  token = res.body.token;
});

afterAll(async () => {
    // Delete the test user by email
    await mongoose.connection.db.collection('signups').deleteMany({ email: /testuser/i });
  
    // Delete the test property by title or description
    await mongoose.connection.db.collection('commercial_rents').deleteMany({ locality_description: 'unit testing' });

    await mongoose.connection.close();
  });

describe('POST /api/commercial_rent', () => {
    it('should post commercial rent property with images', async () => {
      console.log("Sending request to /api/commercial_rent");
        const res = await request(app)
          .post('/api/commercial_rent')
          .set('Authorization', `Bearer ${token}`)
          .field('property_type', 'Apartment')
          .field('building_type', 'Apartment')
          .field('floors', 3)
          .field('totalfloor', 5)
          .field('age', 5)
          .field('builtuparea', 1200)
          .field('carpetarea', 1500)
          .field('Expected_rent', 25000)
          .field('Expected_deposit', 50000)
          .field('Rent_Negotiable', 'true')
          .field('lease', 10)
          .field('available_from', '2024-05-01')
          .field('Propertytax', 'Yes')
          .field('Occupancy', 'Yes')
          .field('city', 'Hyderabad')
          .field('locality', 'Madhapur')
          .field('landmark_street', 'Near Metro')
          .field('locality_description', 'unit testing')
          .field('wash', 'yes')
          .field('lift', 'yes')
          .field('powerbackup', 'yes')
          .field('water_supply', 'Corporation')
          .field('parking', 'yes')
          .field('security', 'true')
          .field('Availability', 'Weekends')
          .field('start_time', '10:00')
          .field('end_time', '18:00')
          .field('Directions', 'Lift') // If you're sending an array, you can repeat this line
          .attach('image', imagePath) //Upload the image file

        console.log("Response: ", res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message');
    });
      

  it('should fail if token is missing', async () => {
    const res = await request(app)
          .post('/api/commercial_rent')
          .field('property_type', 'Apartment')
          .field('building_type', 'Apartment')
          .field('floors', 3)
          .field('totalfloor', 5)
          .field('age', 5)
          .field('builtuparea', 1200)
          .field('carpetarea', 1500)
          .field('Expected_rent', 25000)
          .field('Expected_deposit', 50000)
          .field('Rent_Negotiable', 'true')
          .field('lease', 10)
          .field('available_from', '2024-05-01')
          .field('Propertytax', 'Yes')
          .field('Occupancy', 'Yes')
          .field('city', 'Hyderabad')
          .field('locality', 'Madhapur')
          .field('landmark_street', 'Near Metro')
          .field('locality_description', 'unit testing')
          .field('wash', 'yes')
          .field('lift', 'yes')
          .field('powerbackup', 'yes')
          .field('water_supply', 'Corporation')
          .field('parking', 'yes')
          .field('security', 'true')
          .field('Availability', 'Weekends')
          .field('start_time', '10:00')
          .field('end_time', '18:00')
          .field('Directions', 'Lift') // If you're sending an array, you can repeat this line

      expect(res.statusCode).toBe(401);
    });
});
