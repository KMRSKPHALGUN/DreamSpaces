const request = require('supertest');
const app = require('../app'); // Your Express app
const mongoose = require('mongoose');

// Optional: Clean up DB after tests
afterAll(async () => {
    await mongoose.connection.db.collection('signups').deleteMany({ email: /testuser/i });
    await mongoose.connection.close();
});

describe('Auth APIs', () => {

  const testUser = {
    name: 'Test User',
    email: 'testuser@gmail.com',
    password: 'testpassword',
    confirmPassword: 'testpassword',
    phone: '1234567890',
    otpEmail: '123456'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(testUser);
  
    console.log('Register Response:', res.body); //Prints the message
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
  
  it('should log in the registered user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
  
    console.log('Login Response:', res.body); //Prints the token/message
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.message).toBe('Login Successful');
  });
  

});
