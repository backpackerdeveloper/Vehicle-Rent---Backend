#!/bin/bash

echo "🚀 Starting Vehicle Rental Backend Server"
echo "=========================================="
echo ""

# Check if PostgreSQL is accessible
echo "Checking PostgreSQL connection..."
if npx prisma db execute --stdin <<< "SELECT 1;" 2>/dev/null | grep -q "1"; then
    echo "✅ PostgreSQL is accessible"
else
    echo "❌ PostgreSQL is not accessible"
    echo ""
    echo "Please start PostgreSQL first:"
    echo "  Option 1: docker compose up -d"
    echo "  Option 2: brew services start postgresql@15"
    echo "  Option 3: Start your PostgreSQL service manually"
    echo ""
    read -p "Press Enter after starting PostgreSQL, or Ctrl+C to exit..."
fi

# Run migrations
echo ""
echo "Running database migrations..."
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed"
    
    # Seed database
    echo ""
    echo "Seeding database..."
    npm run seed
    
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded"
        echo ""
        echo "Starting server..."
        echo "Server will be available at: http://localhost:3000"
        echo "API Docs: http://localhost:3000/docs"
        echo ""
        npm run dev
    else
        echo "⚠️  Seeding failed, but continuing..."
        echo ""
        echo "Starting server..."
        npm run dev
    fi
else
    echo "❌ Migration failed. Please check PostgreSQL connection."
    exit 1
fi
