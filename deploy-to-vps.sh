#!/bin/bash

# Deployment script for Digital Menu on VPS
# Run this on your VPS at 76.13.48.245

echo "🚀 Starting deployment..."

# Update system packages
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    npm install -g pm2
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📥 Installing Nginx..."
    apt install -y nginx
fi

# Navigate to web directory
cd /var/www || exit

# Clone or pull the repository
if [ -d "digital_menu" ]; then
    echo "📂 Updating existing repository..."
    cd digital_menu
    git pull origin main
else
    echo "📂 Cloning repository..."
    git clone https://github.com/ibrahim362-ai/digital_menu.git
    cd digital_menu
fi

# Setup Backend
echo "🔧 Setting up backend..."
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="postgresql://simoo:O@76.13.48.245:3600/A?schema=public"

# JWT Secrets
JWT_SECRET="6324e4bcbccc693459619dacecd49be7653341ad48e9da4d76e7f7ba9719b63e"
JWT_REFRESH_SECRET="579c1333f3636f257a084a359349b2cc6975cb77af20809c6b84503e98203b19"

# Environment
NODE_ENV="production"

# CORS
CORS_ORIGIN="https://simoo.skoolific.com"

# Server
PORT=5050
EOF

# Run Prisma migrations
npx prisma generate
npx prisma migrate deploy

# Stop existing PM2 process if running
pm2 delete digital-menu-backend 2>/dev/null || true

# Start backend with PM2
pm2 start src/app.js --name "digital-menu-backend" --node-args="--max-old-space-size=2048"
pm2 save
pm2 startup

# Setup Frontend
echo "🎨 Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

# Create production .env
cat > .env << 'EOF'
VITE_API_URL=https://simoo.skoolific.com/api
EOF

# Build frontend
npm run build

# Copy build to Nginx directory
rm -rf /var/www/html/digital-menu
mkdir -p /var/www/html/digital-menu
cp -r dist/* /var/www/html/digital-menu/

# Configure Nginx
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/digital-menu << 'EOF'
server {
    listen 80;
    server_name simoo.skoolific.com;

    # Frontend
    location / {
        root /var/www/html/digital-menu;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend uploads
    location /uploads {
        proxy_pass http://localhost:5050;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Install SSL certificate with Certbot (optional but recommended)
if ! command -v certbot &> /dev/null; then
    echo "📜 Installing Certbot for SSL..."
    apt install -y certbot python3-certbot-nginx
fi

echo "🔒 Setting up SSL certificate..."
certbot --nginx -d simoo.skoolific.com --non-interactive --agree-tos --email your-email@example.com || echo "⚠️  SSL setup skipped. Run manually: certbot --nginx -d simoo.skoolific.com"

echo "✅ Deployment complete!"
echo "🌐 Frontend: https://simoo.skoolific.com"
echo "🔧 Backend: https://simoo.skoolific.com/api"
echo ""
echo "📊 Check backend status: pm2 status"
echo "📝 View backend logs: pm2 logs digital-menu-backend"
echo "🔄 Restart backend: pm2 restart digital-menu-backend"
