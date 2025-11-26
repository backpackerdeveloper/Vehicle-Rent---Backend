# Vehicle Rental Backend API

A production-quality, scalable backend system for a Vehicle Rental Application built with Node.js, TypeScript, Express.js, and PostgreSQL. This project demonstrates clean architecture principles, SOLID design patterns, and industry best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Design Principles](#design-principles)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)

---

## 🎯 Overview

This backend API provides a complete solution for managing vehicle rentals, including user authentication, store management, vehicle listings, rental requests, payment processing, and receipt generation. The system supports two user roles: **Customers** (who rent vehicles) and **Owners** (who manage stores and vehicles).

### Key Highlights

- Clean Architecture with layered design
- Type-safe TypeScript implementation
- JWT authentication with refresh tokens
- Modular, scalable architecture
- Comprehensive error handling and logging
- Swagger/OpenAPI documentation

---

## ✨ Features

- **Authentication**: JWT tokens, refresh tokens, password reset, role-based access
- **Store Management**: CRUD operations, location filtering, pagination
- **Vehicle Management**: CRUD with images, availability management
- **Rental Management**: Request/approve/reject, renewal, status tracking
- **Payment Processing**: Mock payments, multiple methods, receipt generation
- **Additional**: Email notifications, background jobs, file uploads, logging

---

## 🛠 Tech Stack

- **Runtime**: Node.js (LTS), TypeScript (5.3+)
- **Framework**: Express.js (4.18+)
- **Database**: PostgreSQL (15+), Prisma ORM (5.7+)
- **Auth**: jsonwebtoken, bcrypt, express-rate-limit
- **Validation**: Zod
- **Security**: Helmet, CORS
- **File Handling**: Multer, PDFKit
- **Email**: Nodemailer
- **Logging**: Pino, pino-http
- **Documentation**: Swagger UI Express, swagger-jsdoc
- **Testing**: Jest, Supertest, ts-jest
- **Dev Tools**: ts-node-dev, ESLint, Prettier, Husky

---

## 🏗 Architecture

### Clean Architecture / Layered Architecture

The project follows Clean Architecture principles with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Controllers Layer               │
│  (HTTP Request/Response Handling)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Services Layer                  │
│  (Business Logic & Orchestration)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Repositories Layer                 │
│  (Data Access & Prisma Queries)        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Database Layer                  │
│  (PostgreSQL via Prisma)                │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

- **Controllers**: Handle HTTP requests/responses, delegate to services
- **Services**: Business logic and orchestration, depend on repositories
- **Repositories**: Data access layer, only modules importing Prisma
- **Middlewares**: Cross-cutting concerns (auth, validation, errors, logging)

---

## 📁 Project Structure

```
vehicle-rental-backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── env.ts           # Environment variables validation
│   │   ├── logger.ts        # Pino logger setup
│   │   └── prismaClient.ts  # Prisma client singleton
│   │
│   ├── controllers/         # HTTP request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── store.controller.ts
│   │   ├── vehicle.controller.ts
│   │   ├── vehicleImage.controller.ts
│   │   ├── rental.controller.ts
│   │   └── payment.controller.ts
│   │
│   ├── services/            # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── store.service.ts
│   │   ├── vehicle.service.ts
│   │   ├── rental.service.ts
│   │   └── payment.service.ts
│   │
│   ├── repositories/        # Data access layer
│   │   ├── user.repository.ts
│   │   ├── store.repository.ts
│   │   ├── vehicle.repository.ts
│   │   ├── rental.repository.ts
│   │   ├── payment.repository.ts
│   │   └── refreshToken.repository.ts
│   │
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── requestLogger.middleware.ts
│   │
│   ├── schemas/             # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── user.schema.ts
│   │   ├── store.schema.ts
│   │   ├── vehicle.schema.ts
│   │   ├── rental.schema.ts
│   │   └── payment.schema.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   ├── pdf.util.ts
│   │   ├── email.util.ts
│   │   ├── pagination.util.ts
│   │   ├── response.util.ts
│   │   ├── upload.util.ts
│   │   └── errors.ts
│   │
│   ├── routes/              # Route definitions
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── store.routes.ts
│   │   ├── vehicle.routes.ts
│   │   ├── rental.routes.ts
│   │   └── payment.routes.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── jobs/                # Background job workers
│   │   ├── queue.ts
│   │   └── workers.ts
│   │
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Server entry point
│
├── prisma/
│   ├── schema.prisma        # Prisma schema definition
│   ├── migrations/          # Database migrations
│   └── seed.ts              # Database seeding script
│
├── tests/
│   ├── unit/                # Unit tests
│   │   ├── auth.service.test.ts
│   │   └── password.util.test.ts
│   ├── integration/         # Integration tests
│   │   └── auth.test.ts
│   └── setup.ts             # Test setup
│
├── uploads/                 # Local file storage
│   ├── vehicles/           # Vehicle images
│   └── receipts/           # Generated receipts
│
├── .env                     # Environment variables (not in git)
├── .env.example            # Environment variables template
├── docker-compose.yml      # PostgreSQL Docker setup
├── jest.config.js          # Jest configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

---

## 🎨 Design Principles

This project follows **SOLID principles** and **Clean Architecture** patterns:

- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **Clean Architecture**: Layered architecture with clear separation of concerns
- **Dependency Injection**: Services accept repositories via constructor for testability
- **Separation of Concerns**: Controllers (HTTP), Services (Business Logic), Repositories (Data Access)

### Code Quality Practices

- **Type Safety**: Strict TypeScript, Zod validation, Prisma type inference
- **Error Handling**: Custom error classes with centralized error middleware
- **Validation**: Zod schemas for all inputs with type-safe validation
- **Logging**: Structured logging with Pino, request/response logging
- **Security**: bcrypt password hashing, JWT authentication, rate limiting, Helmet.js, CORS

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 15.0
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vehicle-rental-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)
   - `SMTP_*` - Email configuration (for password reset)

4. **Start PostgreSQL**
   
   **Option A: Docker (Recommended)**
   ```bash
   docker compose up -d
   ```
   
   **Option B: Local PostgreSQL**
   ```bash
   createdb vehicle_rental
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

7. **Seed the database (optional)**
   ```bash
   npm run seed
   ```
   This creates:
   - 1 customer user: `customer@example.com` / `customer123`
   - 1 owner user: `owner@example.com` / `owner123`
   - 1 store with 10 vehicles

8. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

- **API Base**: `http://localhost:3000/api/v1`
- **Swagger Docs**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/health`

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio
npm run seed               # Seed database

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

---

## 🗄 Database Schema

The database schema is defined in `prisma/schema.prisma`. Key entities:

- **User**: Customers and Owners with authentication
- **Store**: Rental stores owned by Owners
- **Vehicle**: Vehicles available for rent with images
- **RentalRequest**: Customer rental requests with status tracking
- **Payment**: Payment records linked to rentals
- **RefreshToken**: JWT refresh token storage

See `prisma/schema.prisma` for complete schema definition with all fields and relationships.

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Test Credentials
- **Customer**: `customer@example.com` / `customer123`
- **Owner**: `owner@example.com` / `owner123`

---

## Health Check

### Get Server Status
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-25T20:44:36.971Z"
}
```

---

## Authentication

### 1. Signup
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token"
  },
  "message": "User registered successfully"
}
```

---

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "customer123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Customer",
      "email": "customer@example.com",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token"
  },
  "message": "Login successful"
}
```

---

### 3. Refresh Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  },
  "message": "Token refreshed successfully"
}
```

---

### 4. Logout
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

---

### 5. Forgot Password
```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com"
  }'
```

---

### 6. Reset Password
```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_from_email",
    "password": "new_password123"
  }'
```

---

## Users

### 1. Get User Profile
```bash
curl http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Customer",
    "email": "customer@example.com",
    "role": "CUSTOMER",
    "createdAt": "2025-11-25T20:43:27.844Z",
    "updatedAt": "2025-11-25T20:43:27.844Z"
  }
}
```

---

### 2. Update User Profile
```bash
curl -X PUT http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "newemail@example.com"
  }'
```

---

## Stores

### 1. Get All Stores
```bash
curl "http://localhost:3000/api/v1/stores?page=1&limit=10&location=New%20York"
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `location` (optional): Filter by location

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "store-1",
        "ownerId": "uuid",
        "name": "Premium Vehicle Rentals",
        "location": "123 Main Street, New York, NY 10001",
        "latitude": 40.7128,
        "longitude": -74.006,
        "createdAt": "2025-11-25T20:43:27.844Z",
        "updatedAt": "2025-11-25T20:43:27.844Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

### 2. Get Store by ID
```bash
curl http://localhost:3000/api/v1/stores/store-1
```

---

### 3. Create Store (Owner Only)
```bash
curl -X POST http://localhost:3000/api/v1/stores \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Vehicle Rentals",
    "location": "123 Main Street, New York, NY 10001",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

---

### 4. Get Owner's Stores (Owner Only)
```bash
curl http://localhost:3000/api/v1/stores/owner/my-stores \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN"
```

---

### 5. Update Store (Owner Only)
```bash
curl -X PUT http://localhost:3000/api/v1/stores/store-1 \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Store Name",
    "location": "New Location"
  }'
```

---

### 6. Delete Store (Owner Only)
```bash
curl -X DELETE http://localhost:3000/api/v1/stores/store-1 \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN"
```

---

## Vehicles

### 1. Get Vehicles by Store
```bash
curl "http://localhost:3000/api/v1/vehicles/store/store-1?page=1&limit=10&available=true"
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `available` (optional): Filter available vehicles (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "vehicle-1",
        "storeId": "store-1",
        "title": "2023 Toyota Camry",
        "description": "Reliable and fuel-efficient sedan",
        "rentPerDay": "50.00",
        "rentPerMonth": "1200.00",
        "isAvailable": true,
        "images": [
          {
            "id": "image-id",
            "imageUrl": "https://images.unsplash.com/photo-1621007947382-bb3c399107c9?w=800"
          }
        ],
        "createdAt": "2025-11-25T20:43:27.844Z",
        "updatedAt": "2025-11-25T20:43:27.844Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

---

### 2. Get Vehicle by ID
```bash
curl http://localhost:3000/api/v1/vehicles/vehicle-1
```

---

### 3. Create Vehicle (Owner Only)
```bash
curl -X POST http://localhost:3000/api/v1/vehicles \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "store-1",
    "title": "2023 Toyota Camry",
    "description": "Reliable and fuel-efficient sedan",
    "rentPerDay": 50.0,
    "rentPerMonth": 1200.0,
    "isAvailable": true
  }'
```

---

### 4. Upload Vehicle Image (Owner Only)
```bash
curl -X POST http://localhost:3000/api/v1/vehicles/vehicle-1/images \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

---

### 5. Delete Vehicle Image (Owner Only)
```bash
curl -X DELETE http://localhost:3000/api/v1/vehicles/vehicle-1/images/image-id \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN"
```

---

### 6. Update Vehicle (Owner Only)
```bash
curl -X PUT http://localhost:3000/api/v1/vehicles/vehicle-1 \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Vehicle Title",
    "rentPerDay": 55.0,
    "isAvailable": false
  }'
```

---

### 7. Delete Vehicle (Owner Only)
```bash
curl -X DELETE http://localhost:3000/api/v1/vehicles/vehicle-1 \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN"
```

---

## Rentals

### 1. Create Rental Request (Customer Only)
```bash
curl -X POST http://localhost:3000/api/v1/rentals \
  -H "Authorization: Bearer CUSTOMER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "vehicle-1",
    "startDate": "2024-12-01T00:00:00Z",
    "endDate": "2024-12-05T00:00:00Z"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rental-1",
    "vehicleId": "vehicle-1",
    "customerId": "uuid",
    "startDate": "2024-12-01T00:00:00.000Z",
    "endDate": "2024-12-05T00:00:00.000Z",
    "totalAmount": "200.00",
    "status": "PENDING",
    "createdAt": "2025-11-25T20:43:27.844Z",
    "updatedAt": "2025-11-25T20:43:27.844Z"
  },
  "message": "Rental request created successfully"
}
```

---

### 2. Get Customer Rentals (Customer Only)
```bash
curl "http://localhost:3000/api/v1/rentals/customer/my-rentals?page=1&limit=10" \
  -H "Authorization: Bearer CUSTOMER_ACCESS_TOKEN"
```

---

### 3. Get Owner Rentals (Owner Only)
```bash
curl "http://localhost:3000/api/v1/rentals/owner/my-rentals?page=1&limit=10" \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN"
```

---

### 4. Get Rental by ID
```bash
curl http://localhost:3000/api/v1/rentals/rental-1 \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

---

### 5. Approve Rental (Owner Only)
```bash
curl -X POST http://localhost:3000/api/v1/rentals/rental-1/approve \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rental-1",
    "status": "APPROVED",
    ...
  },
  "message": "Rental approved successfully"
}
```

---

### 6. Reject Rental (Owner Only)
```bash
curl -X POST http://localhost:3000/api/v1/rentals/rental-1/reject \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN"
```

---

### 7. Renew Rental (Customer Only)
```bash
curl -X POST http://localhost:3000/api/v1/rentals/rental-1/renew \
  -H "Authorization: Bearer CUSTOMER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newEndDate": "2024-12-10T00:00:00Z"
  }'
```

---

## Payments

### 1. Process Payment
```bash
curl -X POST http://localhost:3000/api/v1/payments/rental/rental-1 \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "mock",
    "amount": 200.00
  }'
```

**Payment Methods:** `card`, `upi`, `cash`, `mock`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "payment-1",
    "rentalRequestId": "rental-1",
    "amount": "200.00",
    "method": "MOCK",
    "status": "SUCCESS",
    "receiptUrl": "/receipts/receipt-payment-1.pdf",
    "createdAt": "2025-11-25T20:43:27.844Z",
    "updatedAt": "2025-11-25T20:43:27.844Z"
  },
  "message": "Payment processed successfully"
}
```

---

### 2. Get Payment by ID
```bash
curl http://localhost:3000/api/v1/payments/payment-1 \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

---

### 3. Download Receipt
```bash
# PDF format (default)
curl http://localhost:3000/api/v1/payments/payment-1/receipt?format=pdf \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -o receipt.pdf

# JSON format
curl http://localhost:3000/api/v1/payments/payment-1/receipt?format=json \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

**Query Parameters:**
- `format` (optional): `pdf` or `json` (default: `pdf`)

---

## Authentication Headers

Most endpoints require authentication. Include the access token in the Authorization header:

```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Get the access token from the login or signup response.

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Notes

- All dates should be in ISO 8601 format: `2024-12-01T00:00:00Z`
- Pagination: Default page is 1, default limit is 10
- Rate Limiting: Auth endpoints are rate-limited (5 requests per 15 minutes)
- File Uploads: Vehicle images must be JPEG, PNG, or WebP (max 5MB)
- Mock Payments: Use `method: "mock"` for testing payments

---

## Swagger Documentation

Interactive API documentation available at:
**http://localhost:3000/docs**

---

## 📝 License

ISC

---

## 🤝 Contributing

This is a demonstration project showcasing clean architecture and best practices. Feel free to use it as a reference for your own projects.

---

## 📞 Support

For issues and questions, please refer to the Swagger documentation at `/docs` or check the API documentation above.
