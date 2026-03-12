#!/bin/bash

echo "🌐 Setting up HTTP-only configuration (no SSL)..."

# Ensure frontend is built and deployed
echo "📦 Checking frontend build..."
if [ ! -f "/var/www/html/digital-menu/index.html" ]; then
    echo "Building frontend..."
    cd /var/www/digital_menu/frontend
    npm install
    npm run build
    mkdir -p /var/www/html/digital-menu
    cp -r dist/* /var/www/html/digital-menu/
fi

# Set correct permissions
chown -R www-data:www-data /var/www/html/digital-menu
chmod -R 755 /var/www/html/digital-menu

# Create Nginx configuration for HTTP only
cat > /etc/nginx/sites-available/digital-menu << 'EOF'
server {
    listen 80;
    server_name simoo.skoolific.com 76.13.48.245;

    root /var/www/html/digital-menu;
    index index.html;

    # Frontend - serve static files
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5050/api/;
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
    location /uploads/ {
        proxy_pass http://localhost:5050/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Enable the site
ln -sf /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration valid, restarting Nginx..."
    systemctl restart nginx
    
    # Check if backend is running
    echo ""
    echo "🔍 Checking backend status..."
    pm2 status
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "📂 Frontend files:"
    ls -lh /var/www/html/digital-menu/ | head -10
    echo ""
    echo "🌐 Access your site at:"
    echo "   - http://simoo.skoolific.com"
    echo "   - http://76.13.48.245"
    echo ""
    echo "🔧 Admin panel:"
    echo "   - http://simoo.skoolific.com/admin/login"
    echo ""
    echo "⚠️  Note: Using HTTP (not secure). Run ./setup-ssl.sh to enable HTTPS"
else
    echo "❌ Nginx configuration error"
    nginx -t
    exit 1
fi
