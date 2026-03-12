#!/bin/bash

echo "🔧 Fixing 403 Forbidden error..."

# Fix file permissions
echo "📁 Setting correct permissions..."
chown -R www-data:www-data /var/www/html/digital-menu
chmod -R 755 /var/www/html/digital-menu

# Check if index.html exists
if [ ! -f "/var/www/html/digital-menu/index.html" ]; then
    echo "❌ index.html not found! Rebuilding frontend..."
    cd /var/www/digital_menu/frontend
    npm run build
    rm -rf /var/www/html/digital-menu/*
    cp -r dist/* /var/www/html/digital-menu/
    chown -R www-data:www-data /var/www/html/digital-menu
    chmod -R 755 /var/www/html/digital-menu
fi

# Update Nginx configuration
echo "🌐 Updating Nginx configuration..."
cat > /etc/nginx/sites-available/digital-menu << 'EOF'
server {
    listen 80;
    server_name simoo.skoolific.com;

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

# Remove default Nginx site if it's interfering
rm -f /etc/nginx/sites-enabled/default

# Enable the site
ln -sf /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    systemctl restart nginx
    echo "✅ Nginx restarted successfully"
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

# Check if backend is running
echo "🔍 Checking backend status..."
pm2 status

# List files in web directory
echo "📂 Files in /var/www/html/digital-menu:"
ls -la /var/www/html/digital-menu/

echo ""
echo "✅ Fix complete!"
echo "🌐 Try accessing: http://simoo.skoolific.com"
echo ""
echo "If still having issues, check:"
echo "  - Nginx error log: tail -f /var/log/nginx/error.log"
echo "  - Backend logs: pm2 logs digital-menu-backend"
