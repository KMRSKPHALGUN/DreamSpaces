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

describe('GET /api/userDetails', () => {
    it('should retrieve user details', async () => {
        const res = await request(app)
        .get('/api/userdetails')
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
    });

    it('should retrieve user details', async () => {
        const res = await request(app)
        .get('/api/userdetails')

        expect(res.statusCode).toBe(401)
    });

    it('should delete logged in user\'s account', async () => {
        const res = await request(app)
        .post('/api/deleteAccount')
        .set('Authorization', `Bearer ${token}`)
        .field('password', user.password)

        expect(res.statusCode).toBe(200);
    });

    it('should delete logged in user\'s account', async () => {
        const res = await request(app)
        .post('/api/deleteAccount')
        .set('Authorization', `Bearer ${token}`)
        .field('password', 'wrongpass')

        expect(res.statusCode).toBe(401);
    });

    it('should delete logged in user\'s account', async () => {
        const res = await request(app)
        .post('/api/deleteAccount')
        .field('password', user.password)

        expect(res.statusCode).toBe(401);
    });
});