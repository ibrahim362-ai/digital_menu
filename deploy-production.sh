#!/bin/bash

echo "🚀 Production Deployment for simoo.skoolific.com"
echo "================================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root: sudo bash deploy-production.sh"
    exit 1
fi

# Navigate to project directory
cd /var/www/digital_menu || exit 1

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# ============= BACKEND SETUP =============
echo ""
echo "🔧 Setting up backend..."
cd backend

# Install dependencies
npm install

# Create production .env
cat > .env << 'EOF'
DATABASE_URL="postgresql://simoo:O@76.13.48.245:3600/A?schema=public"
JWT_SECRET="6324e4bcbccc693459619dacecd49be7653341ad48e9da4d76e7f7ba9719b63e"
JWT_REFRESH_SECRET="579c1333f3636f257a084a359349b2cc6975cb77af20809c6b84503e98203b19"
NODE_ENV="production"
CORS_ORIGIN="http://simoo.skoolific.com,https://simoo.skoolific.com,http://76.13.48.245"
PORT=5050
EOF

# Run database migrations
echo "📊 Running database migrations..."
npx prisma generate
npx prisma migrate deploy

# Restart backend
echo "🔄 Restarting backend..."
pm2 delete digital-menu-backend 2>/dev/null || true
pm2 start src/app.js --name "digital-menu-backend"
pm2 save

# ============= FRONTEND SETUP =============
echo ""
echo "🎨 Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

# Create production .env with full URL
cat > .env << 'EOF'
VITE_API_URL=http://simoo.skoolific.com/api
EOF

# Build frontend
echo "🏗️  Building frontend..."
npm run build

# Deploy to web directory
echo "📦 Deploying frontend..."
rm -rf /var/www/html/digital-menu/*
mkdir -p /var/www/html/digital-menu
cp -r dist/* /var/www/html/digital-menu/

# Set permissions
chown -R www-data:www-data /var/www/html/digital-menu
chmod -R 755 /var/www/html/digital-menu

# ============= NGINX CONFIGURATION =============
echo ""
echo "🌐 Configuring Nginx..."

cat > /etc/nginx/sites-available/digital-menu << 'EOF'
server {
    listen 80;
    server_name simoo.skoolific.com 76.13.48.245;

    root /var/www/html/digital-menu;
    index index.html;

    # Increase limits
    client_max_body_size 50M;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Backend API
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

    # Backend uploads
    location /uploads/ {
        proxy_pass http://127.0.0.1:5050/uploads/;
        proxy_set_header Host $host;
    }
}
EOF

# Enable site and remove default
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/

# Test and restart Nginx
nginx -t && systemctl restart nginx

# ============= VERIFICATION =============
echo ""
echo "🔍 Verifying deployment..."
echo ""

echo "Backend Status:"
pm2 status

echo ""
echo "Backend Health:"
sleep 2
curl -s http://localhost:5050/api/health && echo " ✅" || echo " ❌"

echo ""
echo "Frontend Files:"
ls -lh /var/www/html/digital-menu/ | head -5

echo ""
echo "================================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "================================================"
echo ""
echo "🌐 Access your site:"
echo "   http://simoo.skoolific.com"
echo "   http://76.13.48.245"
echo ""
echo "🔧 Admin login:"
echo "   http://simoo.skoolific.com/admin/login"
echo ""
echo "📊 Useful commands:"
echo "   pm2 logs digital-menu-backend  # View logs"
echo "   pm2 restart digital-menu-backend  # Restart"
echo "   tail -f /var/log/nginx/error.log  # Nginx errors"
echo ""
