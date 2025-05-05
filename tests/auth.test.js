const request = require('supertest');
const app = require('../app'); // Your Express app
const mongoose = require('mongoose');

// Optional: Clean up DB after tests
afterAll(async () => {
    await mongoose.connection.db.collection('signups').deleteMany({ email: /testuser/i });
    await mongoose.connection.close();
});

describe('Auth APIs', () => {

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'testuser@gmail.com',
        password: 'testpassword',
        confirmPassword: 'testpassword',
        phone: '1234567890',
        otpEmail: '123456'
      });
  
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'testusergmail.com',
        password: 'testpassword',
        confirmPassword: 'testpassword',
        phone: '1234567890',
        otpEmail: '123456'
      });
  
  
    expect(res.statusCode).toBe(400);
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'phalgunkothamasu@gmail.com',
        password: 'testpassword',
        confirmPassword: 'testpassword',
        phone: '1234567890',
        otpEmail: '123456'
      });
  
  
    expect(res.statusCode).toBe(400);
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'testuser@gmail.com',
        password: 'testpassword',
        confirmPassword: 'testpassword',
        phone: '1234567890',
        otpEmail: '123457'
      });
  
  
    expect(res.statusCode).toBe(400);
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'testuser@gmail.com',
        password: 'testpa',
        confirmPassword: 'testpassword',
        phone: '1234567890',
        otpEmail: '123456'
      });
  
    expect(res.statusCode).toBe(400);
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'testuser@gmail.com',
        password: 'test',
        confirmPassword: 'test',
        phone: '1234567890',
        otpEmail: '123456'
      });
  
  
    expect(res.statusCode).toBe(400);
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'testuser@gmail.com',
        password: 'testpassword',
        confirmPassword: 'testpassword',
        phone: '1234',
        otpEmail: '123456'
      });
  
  
    expect(res.statusCode).toBe(400);
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'testuser@gmail.com',
        password: 'testpassword',
        confirmPassword: 'testpassword',
        phone: '8885226140',
        otpEmail: '123456'
      });
  
  
    expect(res.statusCode).toBe(400);
  });
  
  it('should log in the registered user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'testuser@gmail.com',
        password: 'testpassword'
      });
  
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should log in the registered user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'testuser@gmail.com',
        password: 'testpass'
      });
  
  
    expect(res.statusCode).toBe(401);
  });

  it('should log in the registered user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test@gmail.com',
        password: 'testpassword'
      });
  
    expect(res.statusCode).toBe(401);
  });
});
