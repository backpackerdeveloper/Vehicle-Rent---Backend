# Quick Start Guide

Get the Vehicle Rental Backend up and running in 5 minutes.

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 15 (or Docker)
- npm

## Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Start PostgreSQL:**
```bash
# Option A: Docker (recommended)
docker-compose up -d

# Option B: Local PostgreSQL
createdb vehicle_rental
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and set DATABASE_URL and JWT_SECRET
```

4. **Set up database:**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npm run seed
```

5. **Start the server:**
```bash
npm run dev
```

6. **Access the API:**
- API Base: http://localhost:3000/api/v1
- Swagger Docs: http://localhost:3000/docs
- Health Check: http://localhost:3000/health

## Test Credentials (after seeding)

**Customer:**
- Email: `customer@example.com`
- Password: `customer123`

**Owner:**
- Email: `owner@example.com`
- Password: `owner123`

## Quick Test

```bash
# Login as customer
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"customer123"}'

# Get stores
curl http://localhost:3000/api/v1/stores
```

## Troubleshooting

**Prisma Client not found:**
```bash
npx prisma generate
```

**Database connection error:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

**Port already in use:**
- Change PORT in .env
- Or kill process using port 3000

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [PRODUCTION.md](PRODUCTION.md) for production deployment
- Import [postman_collection.json](postman_collection.json) to test APIs


