#!/bin/bash
set -e

echo "🚀 Starting AUTOMATED full deployment..."
echo "⚠️  This script will run without prompts. Use deploy-all.sh for interactive mode."
echo "=================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Check if in correct directory
if [ ! -f "deploy/deploy-all-auto.sh" ]; then
    echo "❌ Please run from the project root directory"
    exit 1
fi

# Step 1: Install required software
echo "📦 [1/8] Installing required software..."
./deploy/install.sh

# Step 2: Setup database
echo "🗄️  [2/8] Setting up database..."
./deploy/setup-database.sh | tee /tmp/db_credentials.txt
DB_PASSWORD=$(grep "Save this password:" /tmp/db_credentials.txt | awk '{print $5}')

# Step 3: Setup backend with auto-generated password
echo "⚙️  [3/8] Setting up backend..."
cd backend
npm install

# Generate JWT secrets
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)

# Create production .env file with database password
cat > .env << EOF
DATABASE_URL="postgresql://restaurant_user:${DB_PASSWORD}@localhost:5432/restaurant_db?schema=public"
JWT_SECRET="${JWT_SECRET}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
NODE_ENV="production"
CORS_ORIGIN="https://simoo.skoolific.com"
PORT=5050
EOF

# Run database migrations
npx prisma generate
npx prisma migrate deploy

# Seed database
node seed.js

cd ..

# Step 4: Setup frontend
echo "🎨 [4/8] Setting up frontend..."
./deploy/setup-frontend.sh

# Step 5: Configure Nginx
echo "🌐 [5/8] Configuring Nginx..."
./deploy/setup-nginx.sh

# Step 6: Start backend
echo "🚀 [6/8] Starting backend..."
./deploy/start-backend.sh

# Step 7: Setup firewall
echo "🔥 [7/8] Configuring firewall..."
./deploy/setup-firewall.sh

# Step 8: Skip SSL for now (can be run manually later)
echo "🔒 [8/8] Skipping SSL setup (run ./deploy/setup-ssl.sh manually when ready)"

# Final verification
echo ""
echo "=================================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=================================================="
echo ""
echo "📊 System Status:"
pm2 status
echo ""
echo "🌐 Access your application:"
echo "   http://simoo.skoolific.com"
echo ""
echo "🔑 Default Admin Login:"
echo "   URL: http://simoo.skoolific.com/admin/login"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo "   ⚠️  CHANGE PASSWORD IMMEDIATELY!"
echo ""
echo "📄 Credentials saved in: /tmp/db_credentials.txt"
echo ""
echo "📝 Next Steps:"
echo "   1. Change admin password"
echo "   2. Run ./deploy/setup-ssl.sh for HTTPS"
echo "   3. Setup automated backups: crontab -e"
echo "      Add: 0 2 * * * /var/www/digital_menu/deploy/backup.sh"
echo ""
