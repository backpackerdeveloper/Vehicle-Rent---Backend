# Vehicle Rental API Documentation

**Base URL:** `http://localhost:3000/api/v1`

**Test Credentials:**
- Customer: `customer@example.com` / `customer123`
- Owner: `owner@example.com` / `owner123`

---

## Table of Contents

1. [Health Check](#health-check)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Stores](#stores)
5. [Vehicles](#vehicles)
6. [Rentals](#rentals)
7. [Payments](#payments)

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
            "imageUrl": "/vehicles/toyota-camry-1.jpg"
          }
        ],
        "createdAt": "2025-11-25T20:43:27.844Z",
        "updatedAt": "2025-11-25T20:43:27.844Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
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


