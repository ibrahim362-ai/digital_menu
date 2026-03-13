#!/bin/bash

# Update Server Script - Pull latest changes and apply updates
# Run this on your server: ssh root@76.13.48.245

set -e

echo "=========================================="
echo "Updating Digital Menu System"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project directory
cd /root/digital_menu || { echo "Project directory not found!"; exit 1; }

echo -e "${BLUE}Step 1: Pulling latest changes from GitHub...${NC}"
git pull origin main

echo -e "${BLUE}Step 2: Updating backend...${NC}"
cd backend

echo "Installing dependencies..."
npm install

echo "Running database migrations..."
npx prisma generate
npx prisma migrate deploy

echo "Applying SEO updates..."
node seed-seo.js

echo "Generating slugs for existing data..."
node generate-slugs.js

echo -e "${BLUE}Step 3: Restarting backend...${NC}"
pm2 restart restaurant-backend
pm2 save

echo -e "${BLUE}Step 4: Updating frontend...${NC}"
cd ../frontend

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

# Update .env with correct API URL
cat > .env << EOF
VITE_API_URL=http://${SERVER_IP}:5000
EOF

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo -e "${BLUE}Step 5: Restarting Nginx...${NC}"
sudo systemctl restart nginx

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Update Complete!"
echo "==========================================${NC}"
echo ""
echo "Your site is now live with SEO features:"
echo "- Frontend: http://${SERVER_IP}"
echo "- Admin: http://${SERVER_IP}/admin"
echo ""
echo "New SEO Features:"
echo "✓ SEO-friendly URL slugs"
echo "✓ Location-based SEO (Dire Dawa, Ethiopia)"
echo "✓ Meta tags and keywords"
echo "✓ Simoo Cafe branding"
echo ""
echo "Check status:"
echo "  pm2 status"
echo "  pm2 logs restaurant-backend"
echo ""
echo -e "${GREEN}Happy hosting! 🚀${NC}"
