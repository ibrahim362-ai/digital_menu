#!/bin/bash

echo "🚀 Complete Deployment Script for Digital Menu"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Step 1: Install required packages
print_info "Step 1: Installing required packages..."
apt update
apt install -y nodejs npm nginx postgresql-client curl git

# Install PM2 globally
npm install -g pm2

print_success "Packages installed"

# Step 2: Create directory structure
print_info "Step 2: Setting up directory structure..."
mkdir -p /var/www/digital_menu
mkdir -p /var/www/html/digital-menu
cd /var/www/digital_menu

print_success "Directories created"

# Step 3: Clone or update repository
print_info "Step 3: Getting latest code..."
if [ -d ".git" ]; then
    git pull origin main
else
    cd /var/www
    rm -rf digital_menu
    git clone https://github.com/ibrahim362-ai/digital_menu.git
    cd digital_menu
fi

print_success "Code updated"

# Step 4: Setup Backend
print_info "Step 4: Setting up backend..."
cd /var/www/digital_menu/backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="postgresql://simoo:O@76.13.48.245:3600/A?schema=public"
JWT_SECRET="6324e4bcbccc693459619dacecd49be7653341ad48e9da4d76e7f7ba9719b63e"
JWT_REFRESH_SECRET="579c1333f3636f257a084a359349b2cc6975cb77af20809c6b84503e98203b19"
NODE_ENV="production"
CORS_ORIGIN="http://simoo.skoolific.com,https://simoo.skoolific.com,http://76.13.48.245"
PORT=5050
EOF

# Generate Prisma client and run migrations
print_info "Running database migrations..."
npx prisma generate
npx prisma migrate deploy

# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Stop existing PM2 process
pm2 delete digital-menu-backend 2>/dev/null || true

# Start backend with PM2
pm2 start src/app.js --name "digital-menu-backend" --node-args="--max-old-space-size=2048"
pm2 save
pm2 startup systemd -u root --hp /root

print_success "Backend configured and started"

# Step 5: Setup Frontend
print_info "Step 5: Setting up frontend..."
cd /var/www/digital_menu/frontend

# Install dependencies
npm install

# Create production .env (use relative path for API)
cat > .env << 'EOF'
VITE_API_URL=/api
EOF

# Build frontend
print_info "Building frontend (this may take a few minutes)..."
npm run build

# Deploy to web directory
rm -rf /var/www/html/digital-menu/*
cp -r dist/* /var/www/html/digital-menu/

# Set correct permissions
chown -R www-data:www-data /var/www/html/digital-menu
chmod -R 755 /var/www/html/digital-menu

print_success "Frontend built and deployed"

# Step 6: Configure Nginx
print_info "Step 6: Configuring Nginx..."

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Create Nginx configuration
cat > /etc/nginx/sites-available/digital-menu << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name simoo.skoolific.com 76.13.48.245 _;

    root /var/www/html/digital-menu;
    index index.html;

    # Increase buffer sizes for large requests
    client_max_body_size 50M;
    client_body_buffer_size 128k;

    # Frontend - serve static files
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5050/api/;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffering
        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend uploads
    location /uploads/ {
        proxy_pass http://127.0.0.1:5050/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Cache uploaded images
        add_header Cache-Control "public, max-age=31536000";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/

# Test Nginx configuration
print_info "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    systemctl restart nginx
    print_success "Nginx configured and restarted"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Step 7: Configure firewall (if UFW is installed)
if command -v ufw &> /dev/null; then
    print_info "Step 7: Configuring firewall..."
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 5050/tcp
    print_success "Firewall configured"
fi

# Step 8: Final checks
print_info "Step 8: Running final checks..."

echo ""
echo "Backend Status:"
pm2 status

echo ""
echo "Backend Health Check:"
sleep 2
curl -s http://localhost:5050/api/health || print_error "Backend not responding"

echo ""
echo "Frontend Files:"
ls -lh /var/www/html/digital-menu/ | head -5

echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager | head -5

echo ""
echo "================================================"
print_success "DEPLOYMENT COMPLETE!"
echo "================================================"
echo ""
echo "🌐 Your application is now available at:"
echo "   - http://simoo.skoolific.com"
echo "   - http://76.13.48.245"
echo ""
echo "🔧 Admin Panel:"
echo "   - http://simoo.skoolific.com/admin/login"
echo ""
echo "📊 Useful Commands:"
echo "   - View backend logs: pm2 logs digital-menu-backend"
echo "   - Restart backend: pm2 restart digital-menu-backend"
echo "   - View Nginx logs: tail -f /var/log/nginx/error.log"
echo "   - Check status: pm2 status"
echo ""
echo "🔒 To enable HTTPS, run: certbot --nginx -d simoo.skoolific.com"
echo ""
