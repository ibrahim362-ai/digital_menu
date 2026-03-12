#!/bin/bash

echo "🔧 Quick Fix Script"
echo "==================="
echo ""

# Fix 1: Ensure backend is running
echo "1. Checking backend..."
pm2 restart digital-menu-backend 2>/dev/null || pm2 start /var/www/digital_menu/backend/src/app.js --name "digital-menu-backend"
sleep 3
pm2 status

# Fix 2: Test backend health
echo ""
echo "2. Testing backend health..."
curl -s http://localhost:5050/api/health && echo " ✅ Backend is healthy" || echo " ❌ Backend not responding"

# Fix 3: Rebuild and redeploy frontend
echo ""
echo "3. Rebuilding frontend..."
cd /var/www/digital_menu/frontend
npm run build
rm -rf /var/www/html/digital-menu/*
cp -r dist/* /var/www/html/digital-menu/
chown -R www-data:www-data /var/www/html/digital-menu
chmod -R 755 /var/www/html/digital-menu

# Fix 4: Restart Nginx
echo ""
echo "4. Restarting Nginx..."
nginx -t && systemctl restart nginx

# Fix 5: Check if files exist
echo ""
echo "5. Checking deployed files..."
ls -lh /var/www/html/digital-menu/ | head -10

echo ""
echo "✅ Quick fix complete!"
echo ""
echo "Try accessing: http://simoo.skoolific.com"
