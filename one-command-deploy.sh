#!/bin/bash

# One-Command Deployment Script for Digital Menu
# Run this on your VPS: bash <(curl -s https://raw.githubusercontent.com/ibrahim362-ai/digital_menu/main/one-command-deploy.sh)

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🍽️  Digital Menu - One Command Deployment            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root"
    exit 1
fi

# Step 1: Install Node.js
print_step "Step 1/10: Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    print_success "Node.js installed"
else
    print_success "Node.js already installed ($(node -v))"
fi

# Step 2: Install PM2
print_step "Step 2/10: Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

# Step 3: Install Nginx
print_step "Step 3/10: Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    print_success "Nginx installed"
else
    print_success "Nginx already installed"
fi

# Step 4: Clone repository to /root/api
print_step "Step 4/10: Cloning repository..."
cd /root
if [ -d "api" ]; then
    print_warning "Directory /root/api exists, backing up..."
    mv api api.backup.$(date +%s)
fi

git clone https://github.com/ibrahim362-ai/digital_menu.git temp_repo
mkdir -p api
cp -r temp_repo/backend/* api/
rm -rf temp_repo
cd api

print_success "Repository cloned to /root/api"

# Step 5: Install backend dependencies
print_step "Step 5/10: Installing backend dependencies..."
npm install
print_success "Dependencies installed"

# Step 6: Configure backend
print_step "Step 6/10: Configuring backend..."
cat > .env << 'EOF'
DATABASE_URL="postgresql://simoo:O@76.13.48.245:3600/A?schema=public"
JWT_SECRET="6324e4bcbccc693459619dacecd49be7653341ad48e9da4d76e7f7ba9719b63e"
JWT_REFRESH_SECRET="579c1333f3636f257a084a359349b2cc6975cb77af20809c6b84503e98203b19"
NODE_ENV="production"
CORS_ORIGIN="http://simoo.skoolific.com,https://simoo.skoolific.com,http://76.13.48.245"
PORT=5050
EOF

# Create server.js if it doesn't exist
if [ ! -f "server.js" ]; then
    cat > server.js << 'EOF'
import('./src/app.js')
  .then(() => console.log('✅ Server started'))
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
EOF
fi

print_success "Backend configured"

# Step 7: Setup database
print_step "Step 7/10: Setting up database..."
npx prisma generate
npx prisma migrate deploy
print_success "Database configured"

# Step 8: Start backend
print_step "Step 8/10: Starting backend..."
pm2 delete digital-menu-backend 2>/dev/null || true
lsof -ti:5050 | xargs kill -9 2>/dev/null || true
pm2 start server.js --name "digital-menu-backend"
pm2 save
pm2 startup systemd -u root --hp /root
print_success "Backend started"

# Step 9: Setup frontend
print_step "Step 9/10: Setting up frontend..."
cd /root
git clone https://github.com/ibrahim362-ai/digital_menu.git temp_frontend
cd temp_frontend/frontend

npm install

cat > .env << 'EOF'
VITE_API_URL=http://simoo.skoolific.com/api
EOF

npm run build

mkdir -p /var/www/html/digital-menu
rm -rf /var/www/html/digital-menu/*
cp -r dist/* /var/www/html/digital-menu/

chown -R www-data:www-data /var/www/html/digital-menu
chmod -R 755 /var/www/html/digital-menu

cd /root
rm -rf temp_frontend

print_success "Frontend deployed"

# Step 10: Configure Nginx
print_step "Step 10/10: Configuring Nginx..."
cat > /etc/nginx/sites-available/digital-menu << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name simoo.skoolific.com 76.13.48.245 _;

    root /var/www/html/digital-menu;
    index index.html;

    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5050/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:5050/uploads/;
        proxy_set_header Host $host;
    }
}
EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/

nginx -t && systemctl restart nginx
print_success "Nginx configured"

# Final verification
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  🎉 DEPLOYMENT COMPLETE!                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

print_step "Verification:"
echo ""

echo "Backend Status:"
pm2 status

echo ""
echo "Backend Health Check:"
sleep 3
curl -s http://localhost:5050/api/health && print_success "Backend is healthy" || print_error "Backend not responding"

echo ""
echo "Frontend Files:"
ls -lh /var/www/html/digital-menu/ | head -5

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    🌐 ACCESS YOUR SITE                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  🌍 Website:      http://simoo.skoolific.com"
echo "  🌍 IP Address:   http://76.13.48.245"
echo "  🔧 Admin Panel:  http://simoo.skoolific.com/admin/login"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   📊 USEFUL COMMANDS                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  View logs:       pm2 logs digital-menu-backend"
echo "  Restart:         pm2 restart digital-menu-backend"
echo "  Stop:            pm2 stop digital-menu-backend"
echo "  Status:          pm2 status"
echo "  Nginx logs:      tail -f /var/log/nginx/error.log"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              🔒 ENABLE HTTPS (RECOMMENDED)                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  apt install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d simoo.skoolific.com"
echo ""
print_success "Deployment completed successfully!"
