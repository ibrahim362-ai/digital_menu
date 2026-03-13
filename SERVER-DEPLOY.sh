#!/bin/bash

# Digital Menu - Server Deployment Script
# Run this script on your Ubuntu server after SSH

set -e

echo "=========================================="
echo "Digital Menu - Server Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use: sudo su)${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Updating system...${NC}"
apt update && apt upgrade -y

echo -e "${BLUE}Step 2: Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo -e "${BLUE}Step 3: Installing PostgreSQL...${NC}"
apt install -y postgresql postgresql-contrib

echo -e "${BLUE}Step 4: Installing PM2...${NC}"
npm install -g pm2

echo -e "${BLUE}Step 5: Installing Nginx...${NC}"
apt install -y nginx

echo -e "${BLUE}Step 6: Cloning repository...${NC}"
cd /root
if [ -d "digital_menu" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd digital_menu
    git pull origin main
else
    git clone https://github.com/ibrahim362-ai/digital_menu.git
    cd digital_menu
fi

echo -e "${BLUE}Step 7: Setting up database...${NC}"
sudo -u postgres psql -c "CREATE DATABASE restaurant_db;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER restaurant_user WITH PASSWORD 'restaurant_pass123';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_user;"
sudo -u postgres psql -c "ALTER DATABASE restaurant_db OWNER TO restaurant_user;"

echo -e "${BLUE}Step 8: Configuring backend...${NC}"
cd /root/digital_menu/backend

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://restaurant_user:restaurant_pass123@localhost:5432/restaurant_db"
JWT_SECRET="$(openssl rand -base64 32)"
JWT_REFRESH_SECRET="$(openssl rand -base64 32)"
PORT=5000
NODE_ENV=production
EOF

echo "Installing backend dependencies..."
npm install

echo "Running database migrations..."
npx prisma generate
npx prisma migrate deploy

echo "Seeding database..."
node seed.js

echo "Generating SEO slugs..."
node generate-slugs.js

echo -e "${BLUE}Step 9: Starting backend with PM2...${NC}"
pm2 delete restaurant-backend 2>/dev/null || true
pm2 start server.js --name restaurant-backend
pm2 save
pm2 startup systemd -u root --hp /root

echo -e "${BLUE}Step 10: Building frontend...${NC}"
cd /root/digital_menu/frontend

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

# Create .env file
cat > .env << EOF
VITE_API_URL=http://${SERVER_IP}:5000
EOF

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo -e "${BLUE}Step 11: Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/digital-menu << EOF
server {
    listen 80;
    server_name ${SERVER_IP};

    # Frontend
    location / {
        root /root/digital_menu/frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    # Uploads
    location /uploads {
        alias /root/digital_menu/backend/uploads;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

echo -e "${BLUE}Step 12: Configuring firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${GREEN}Your application is now live!${NC}"
echo ""
echo "Frontend: http://${SERVER_IP}"
echo "Backend API: http://${SERVER_IP}:5000"
echo "Admin Panel: http://${SERVER_IP}/admin"
echo ""
echo "Default Admin Credentials:"
echo "Email: admin@restaurant.com"
echo "Password: admin123"
echo ""
echo -e "${RED}⚠️  IMPORTANT: Change the admin password immediately!${NC}"
echo ""
echo "Useful Commands:"
echo "  pm2 status              - Check backend status"
echo "  pm2 logs restaurant-backend - View backend logs"
echo "  pm2 restart restaurant-backend - Restart backend"
echo "  systemctl status nginx  - Check Nginx status"
echo "  systemctl restart nginx - Restart Nginx"
echo ""
echo "To update your application:"
echo "  cd /root/digital_menu"
echo "  git pull origin main"
echo "  cd backend && npm install && pm2 restart restaurant-backend"
echo "  cd ../frontend && npm install && npm run build"
echo ""
echo -e "${GREEN}Happy hosting! 🚀${NC}"
