#!/bin/bash

echo "🔍 Running diagnostics..."
echo ""

echo "1️⃣ Checking Nginx status:"
systemctl status nginx --no-pager | head -5
echo ""

echo "2️⃣ Checking backend (PM2) status:"
pm2 status
echo ""

echo "3️⃣ Checking if port 5050 is listening:"
netstat -tlnp | grep 5050 || ss -tlnp | grep 5050
echo ""

echo "4️⃣ Checking frontend files:"
ls -la /var/www/html/digital-menu/ | head -10
echo ""

echo "5️⃣ Checking file permissions:"
ls -ld /var/www/html/digital-menu
echo ""

echo "6️⃣ Nginx error log (last 10 lines):"
tail -10 /var/log/nginx/error.log
echo ""

echo "7️⃣ Nginx access log (last 5 lines):"
tail -5 /var/log/nginx/access.log
echo ""

echo "8️⃣ Backend logs (last 20 lines):"
pm2 logs digital-menu-backend --lines 20 --nostream
echo ""

echo "9️⃣ Testing backend health:"
curl -s http://localhost:5050/api/health || echo "Backend not responding"
echo ""

echo "🔟 Current Nginx configuration:"
cat /etc/nginx/sites-available/digital-menu
