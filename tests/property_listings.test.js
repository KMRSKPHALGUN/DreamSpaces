const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let token;

const user = {
    name: 'Test User',
    email: 'testuser@gmail.com',
    password: 'testpassword',
    confirmPassword: 'testpassword',
    phone: '1234567890',
    otpEmail: '123456'
};

beforeAll(async () =>{
    const reg_res = await request(app).post('/api/register').send(user);

    const res = await request(app).post('/api/login').send({
        email: user.email,
        password: user.password
    });

    token = res.body.token;
});

afterAll(async () => {
    await mongoose.connection.db.collection('signups').deleteMany({ email: /testuser/i});

    await mongoose.connection.close();
});

describe('POST /api/property_listings', () => {
    it('should return properties', async () => {
        const res = await request(app)
        .post('/api/property_listings')
        .set('Authorization', `Bearer ${token}`)
        .field('city', 'Hyderabad')
        .field('property_type', 'commercial')
        .field('ad_type', 'rent')

        expect(res.statusCode).toBe(201)
    });

    it('should return properties', async () => {
        const res = await request(app)
        .post('/api/property_listings')
        .field('city', 'Hyderabad')
        .field('property_type', 'commercial')
        .field('ad_type', 'rent')

        expect(res.statusCode).toBe(401)
    });
})