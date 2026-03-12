#!/bin/bash
set -e

# Generate secure password
DB_PASSWORD=$(openssl rand -base64 32)

echo "🗄️ Setting up PostgreSQL database..."

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE restaurant_db;
CREATE USER restaurant_user WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_user;
\q
EOF

echo "✅ Database created successfully!"
echo "📝 Save this password: $DB_PASSWORD"
echo ""
echo "Add this to your backend/.env file:"
echo "DATABASE_URL=\"postgresql://restaurant_user:$DB_PASSWORD@localhost:5432/restaurant_db?schema=public\""
