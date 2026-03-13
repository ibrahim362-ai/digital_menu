#!/bin/bash

# Simoo Cafe Deployment Script
# Deploy to: https://simoo.skoolific.com
# Server: 76.13.48.245

set -e

echo "=========================================="
echo "Simoo Cafe - Deployment to simoo.skoolific.com"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

DOMAIN="simoo.skoolific.com"
SERVER_IP="76.13.48.245"

echo -e "${BLUE}Step 1: Updating system...${NC}"
apt update && apt upgrade -y

echo -e "${BLUE}Step 2: Installing Node.js 20...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
echo "Node version: $(node -v)"

echo -e "${BLUE}Step 3: Installing PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    apt install -y postgresql postgresql-contrib
fi

echo -e "${BLUE}Step 4: Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

echo -e "${BLUE}Step 5: Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
fi

echo -e "${BLUE}Step 6: Cloning/Updating repository...${NC}"
cd /root
if [ -d "digital_menu" ]; then
    echo "Repository exists, pulling latest changes..."
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
CORS_ORIGIN=https://${DOMAIN},https://www.${DOMAIN},http://${DOMAIN}
EOF

echo "Installing backend dependencies..."
npm install

echo "Running database migrations..."
npx prisma generate
npx prisma migrate deploy

echo "Seeding database with Simoo Cafe data..."
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

# Create .env file for frontend
cat > .env << EOF
VITE_API_URL=https://${DOMAIN}/api
EOF

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo -e "${BLUE}Step 11: Configuring Nginx for ${DOMAIN}...${NC}"
cat > /etc/nginx/sites-available/simoo-cafe << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN} ${SERVER_IP};

    # Frontend
    location / {
        root /root/digital_menu/frontend/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
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
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Uploads
    location /uploads {
        alias /root/digital_menu/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/simoo-cafe /etc/nginx/sites-enabled/
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

echo -e "${BLUE}Step 13: Installing SSL certificate...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
fi

echo ""
echo -e "${YELLOW}=========================================="
echo "SSL Certificate Setup"
echo "==========================================${NC}"
echo ""
echo "To enable HTTPS for ${DOMAIN}, run:"
echo ""
echo -e "${GREEN}certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}${NC}"
echo ""
echo "This will:"
echo "1. Verify domain ownership"
echo "2. Install SSL certificate"
echo "3. Auto-configure Nginx for HTTPS"
echo "4. Set up auto-renewal"
echo ""
echo -e "${YELLOW}Note: Make sure ${DOMAIN} DNS points to ${SERVER_IP} first!${NC}"
echo ""

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${GREEN}Your Simoo Cafe is now live!${NC}"
echo ""
echo "Access your site:"
echo "  HTTP:  http://${DOMAIN}"
echo "  HTTP:  http://${SERVER_IP}"
echo "  Admin: http://${DOMAIN}/admin"
echo ""
echo "After DNS propagates and SSL is installed:"
echo "  HTTPS: https://${DOMAIN}"
echo "  Admin: https://${DOMAIN}/admin"
echo ""
echo "Default Admin Credentials:"
echo "  Email:    ibrahimkamil362@gmail.com"
echo "  Password: Admin@123"
echo ""
echo -e "${RED}⚠️  IMPORTANT:${NC}"
echo "1. Change admin password immediately!"
echo "2. Point ${DOMAIN} DNS to ${SERVER_IP}"
echo "3. Run SSL setup command above"
echo ""
echo "Useful Commands:"
echo "  pm2 status              - Check backend status"
echo "  pm2 logs restaurant-backend - View logs"
echo "  systemctl status nginx  - Check Nginx"
echo "  certbot renew --dry-run - Test SSL renewal"
echo ""
echo -e "${GREEN}Happy hosting! 🚀${NC}"
echo ""
echo "Simoo Cafe - Dire Dawa, Ethiopia"
echo "Best Coffee & Food in Town!"
