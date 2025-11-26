#!/bin/bash

echo "🚀 Vehicle Rental Backend Setup Script"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be >= 18.0.0. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Check PostgreSQL
echo ""
echo "🔍 Checking PostgreSQL connection..."

if docker compose ps postgres 2>/dev/null | grep -q "Up"; then
    echo "✅ PostgreSQL is running in Docker"
    DB_READY=true
elif pg_isready -h localhost -p 5432 &>/dev/null; then
    echo "✅ PostgreSQL is running locally"
    DB_READY=true
else
    echo "⚠️  PostgreSQL is not running"
    echo ""
    echo "Please start PostgreSQL using one of these methods:"
    echo ""
    echo "Option 1: Using Docker Compose (Recommended)"
    echo "  docker compose up -d"
    echo ""
    echo "Option 2: Using local PostgreSQL"
    echo "  # On macOS with Homebrew:"
    echo "  brew services start postgresql@15"
    echo ""
    echo "  # On Linux:"
    echo "  sudo systemctl start postgresql"
    echo ""
    echo "  # Then create database:"
    echo "  createdb vehicle_rental"
    echo ""
    read -p "Press Enter after starting PostgreSQL, or Ctrl+C to exit..."
    DB_READY=false
fi

# Run migrations
if [ "$DB_READY" = true ] || pg_isready -h localhost -p 5432 &>/dev/null; then
    echo ""
    echo "🗄️  Running database migrations..."
    npx prisma migrate dev --name init
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🌱 Seeding database..."
        npm run seed
        
        echo ""
        echo "✅ Setup complete!"
        echo ""
        echo "You can now start the server with:"
        echo "  npm run dev"
        echo ""
        echo "API will be available at:"
        echo "  http://localhost:3000/api/v1"
        echo "  http://localhost:3000/docs (Swagger)"
        echo ""
        echo "Test credentials (after seeding):"
        echo "  Customer: customer@example.com / customer123"
        echo "  Owner: owner@example.com / owner123"
    fi
else
    echo ""
    echo "⚠️  Could not connect to PostgreSQL. Please start it and run:"
    echo "  npx prisma migrate dev --name init"
    echo "  npm run seed"
fi


