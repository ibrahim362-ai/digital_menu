#!/bin/bash
set -e

echo "⚙️ Setting up backend..."

cd /var/www/digital_menu/backend

# Install dependencies
npm install

# Generate JWT secrets
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)

# Create production .env file
cat > .env << EOF
DATABASE_URL="postgresql://restaurant_user:YOUR_DB_PASSWORD@localhost:5432/restaurant_db?schema=public"
JWT_SECRET="$JWT_SECRET"
JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
NODE_ENV="production"
CORS_ORIGIN="https://simoo.skoolific.com"
PORT=5050
EOF

echo "⚠️  IMPORTANT: Update DATABASE_URL in .env with your actual database password!"
echo ""

# Run database migrations
npx prisma generate
npx prisma migrate deploy

# Seed database
node seed.js

echo "✅ Backend setup complete!"
