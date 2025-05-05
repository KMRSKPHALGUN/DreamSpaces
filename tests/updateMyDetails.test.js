const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const path = require('path');

const imagePath = path.join(__dirname, 'sample.jpg');

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

describe('POST /api/updateMyDetails', () => {
    it('should update user details', async () => {
        const res = await request(app)
        .post('/api/updateMyDetails')
        .set('Authorization', `Bearer ${token}`)
        .field('name', user.name)
        .field('email', user.email)
        .field('phone', user.phone)
        .field('bio', 'Nothing')
        .field('motive', ' nothing')
        .attach('image', imagePath)

        expect(res.statusCode).toBe(200);
    });

    it('should update user details', async () => {
        const res = await request(app)
        .post('/api/updateMyDetails')
        .field('name', user.name)
        .field('email', user.email)
        .field('phone', user.phone)
        .field('bio', 'Nothing')
        .field('motive', ' nothing')
        .attach('image', imagePath)

        expect(res.statusCode).toBe(401);
    });

    it('should change password', async () => {
        const res = await request(app)
        .post('/api/changePassword')
        .set('Authorization', `Bearer ${token}`)
        .field('inputPasswordCurrent', user.password)
        .field('inputPasswordNew', 'newpass')
        .field('inputPasswordNew2', 'newpass')

        expect(res.statusCode).toBe(200);
    });

    it('should change password', async () => {
        const res = await request(app)
        .post('/api/changePassword')
        .set('Authorization', `Bearer ${token}`)
        .field('inputPasswordCurrent', 'oldpass')
        .field('inputPasswordNew', 'newpass')
        .field('inputPasswordNew2', 'newpass')

        expect(res.statusCode).toBe(401);
    });

    it('should change password', async () => {
        const res = await request(app)
        .post('/api/changePassword')
        .set('Authorization', `Bearer ${token}`)
        .field('inputPasswordCurrent', user.password)
        .field('inputPasswordNew', 'newpass')
        .field('inputPasswordNew2', 'newpassss')

        expect(res.statusCode).toBe(401);
    });

    it('should change password', async () => {
        const res = await request(app)
        .post('/api/changePassword')
        .field('inputPasswordCurrent', user.password)
        .field('inputPasswordNew', 'newpass')
        .field('inputPasswordNew2', 'newpass')

        expect(res.statusCode).toBe(401);
    });
});