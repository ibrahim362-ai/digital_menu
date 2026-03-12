#!/bin/bash
set -e

echo "🔧 Quick Fix Script - Attempting to resolve common issues..."
echo "=================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Fix 1: Ensure directories exist
echo "📁 Creating necessary directories..."
mkdir -p /var/www/html/simoo.skoolific.com
mkdir -p /var/www/digital_menu/backend/uploads
echo "✅ Directories created"
echo ""

# Fix 2: Set proper permissions
echo "🔐 Setting proper permissions..."
chown -R www-data:www-data /var/www/html/simoo.skoolific.com
chown -R www-data:www-data /var/www/digital_menu/backend/uploads
chmod -R 755 /var/www/html/simoo.skoolific.com
chmod -R 755 /var/www/digital_menu/backend/uploads
echo "✅ Permissions set"
echo ""

# Fix 3: Restart Nginx
echo "🌐 Restarting Nginx..."
if systemctl is-active --quiet nginx; then
    systemctl restart nginx
    echo "✅ Nginx restarted"
else
    systemctl start nginx
    echo "✅ Nginx started"
fi
echo ""

# Fix 4: Check and restart backend
echo "🔧 Checking backend..."
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "restaurant-backend"; then
        echo "Restarting backend..."
        pm2 restart restaurant-backend
        echo "✅ Backend restarted"
    else
        echo "Starting backend..."
        cd /var/www/digital_menu/backend
        pm2 start server.js --name restaurant-backend
        pm2 save
        echo "✅ Backend started"
    fi
else
    echo "⚠️  PM2 not installed. Install with: npm install -g pm2"
fi
echo ""

# Fix 5: Test services
echo "🧪 Testing services..."
sleep 2

if curl -s http://localhost:5050/api/health > /dev/null 2>&1; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend is not responding"
    echo "Check logs with: pm2 logs restaurant-backend"
fi

if curl -s http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Nginx is responding"
else
    echo "❌ Nginx is not responding"
    echo "Check logs with: tail -f /var/log/nginx/error.log"
fi
echo ""

# Fix 6: Show status
echo "📊 Current Status:"
echo "-------------------"
pm2 status 2>/dev/null || echo "PM2 not available"
systemctl status nginx --no-pager | head -n 5
echo ""

echo "=================================================="
echo "✅ Quick fix completed!"
echo "=================================================="
echo ""
echo "Run ./deploy/check-status.sh for detailed diagnostics"
echo ""
