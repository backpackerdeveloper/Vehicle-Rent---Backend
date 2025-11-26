import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prismaClient';
import { hashPassword } from '../../src/utils/password.util';

describe('Auth Integration Tests', () => {
  beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.rentalRequest.deleteMany();
    await prisma.vehicleImage.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.store.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/v1/auth/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'customer',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return error for duplicate email', async () => {
      await prisma.user.create({
        data: {
          name: 'Existing User',
          email: 'test@example.com',
          passwordHash: await hashPassword('password123'),
          role: 'CUSTOMER',
        },
      });

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: await hashPassword('password123'),
          role: 'CUSTOMER',
        },
      });
    });

    it('should login successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong-password',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: await hashPassword('password123'),
          role: 'CUSTOMER',
        },
      });

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      refreshToken = loginResponse.body.data.refreshToken;
    });

    it('should refresh access token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });
  });
});


