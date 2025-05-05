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
    await mongoose.connection.db.collection('residential_rents').deleteMany({ rental_description: 'unit testing' });

    await mongoose.connection.close();
  });

describe('POST /api/residential_rent', () => {
    it('should post residential rent property with images', async () => {
      console.log("Sending request to /api/residential_rent");
        const res = await request(app)
          .post('/api/residential_rent')
          .set('Authorization', `Bearer ${token}`)
          .field('building_type', 'Apartment')
          .field('bhk_type', '2')
          .field('floor_number', 3)
          .field('total_floors', 5)
          .field('property_age', 5)
          .field('facing', 'East')
          .field('built_up_area', 1200)
          .field('expected_rent', 25000)
          .field('expected_deposit', 50000)
          .field('rent_negotiable', 'true')
          .field('monthly_maintenance', '1000')
          .field('available_from', '2024-05-01')
          .field('preferred_tenants', 'Family')
          .field('furnishing', 'Fully Furnished')
          .field('parking', '1 Car')
          .field('rental_description', 'unit testing')
          .field('city', 'Hyderabad')
          .field('locality', 'Madhapur')
          .field('landmark_street', 'Near Metro')
          .field('locality_description', 'Quiet Area')
          .field('bathrooms', 2)
          .field('balcony', 1)
          .field('water_supply', 'Corporation')
          .field('gym', 'true')
          .field('non_veg', 'true')
          .field('gated_security', 'true')
          .field('availability_to_show_property', 'Weekends')
          .field('start_time', '10:00')
          .field('end_time', '18:00')
          .field('amenities', 'Lift') // If you're sending an array, you can repeat this line
          .attach('image', imagePath) //Upload the image file

        console.log("Response: ", res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message');
    });
      

  it('should fail if token is missing', async () => {
    const res = await request(app)
          .post('/api/residential_rent')
          .field('building_type', 'Apartment')
          .field('bhk_type', '2')
          .field('floor_number', 3)
          .field('total_floors', 5)
          .field('property_age', 5)
          .field('facing', 'East')
          .field('built_up_area', 1200)
          .field('expected_rent', 25000)
          .field('expected_deposit', 50000)
          .field('rent_negotiable', 'true')
          .field('monthly_maintenance', 1000)
          .field('available_from', '2024-05-01')
          .field('preferred_tenants', 'Family')
          .field('furnishing', 'Fully Furnished')
          .field('parking', '1 Car')
          .field('rental_description', 'unit testing')
          .field('city', 'Hyderabad')
          .field('locality', 'Madhapur')
          .field('landmark_street', 'Near Metro')
          .field('locality_description', 'Quiet Area')
          .field('bathrooms', 2)
          .field('balcony', 1)
          .field('water_supply', 'Corporation')
          .field('gym', 'true')
          .field('non_veg', 'true')
          .field('gated_security', 'true')
          .field('availability_to_show_property', 'Weekends')
          .field('start_time', '10:00')
          .field('end_time', '18:00')
          .field('amenities', 'Lift') // If you're sending an array, you can repeat this line

      expect(res.statusCode).toBe(401);
    });
});
