#!/bin/bash

echo "🔍 Configuration Check"
echo "====================="
echo ""

echo "1️⃣ Backend Status:"
pm2 status | grep digital-menu-backend || echo "❌ Backend not running"

echo ""
echo "2️⃣ Backend Health Check:"
curl -s http://localhost:5050/api/health | python3 -m json.tool 2>/dev/null || echo "❌ Backend not responding"

echo ""
echo "3️⃣ Backend Environment:"
if [ -f "/var/www/digital_menu/backend/.env" ]; then
    echo "✅ Backend .env exists"
    grep "PORT=" /var/www/digital_menu/backend/.env
    grep "NODE_ENV=" /var/www/digital_menu/backend/.env
else
    echo "❌ Backend .env missing"
fi

echo ""
echo "4️⃣ Frontend Environment:"
if [ -f "/var/www/digital_menu/frontend/.env" ]; then
    echo "✅ Frontend .env exists"
    cat /var/www/digital_menu/frontend/.env
else
    echo "❌ Frontend .env missing"
fi

echo ""
echo "5️⃣ Frontend Deployment:"
if [ -f "/var/www/html/digital-menu/index.html" ]; then
    echo "✅ Frontend deployed"
    ls -lh /var/www/html/digital-menu/ | head -5
else
    echo "❌ Frontend not deployed"
fi

echo ""
echo "6️⃣ Nginx Configuration:"
if [ -f "/etc/nginx/sites-available/digital-menu" ]; then
    echo "✅ Nginx config exists"
    nginx -t 2>&1 | head -2
else
    echo "❌ Nginx config missing"
fi

echo ""
echo "7️⃣ Nginx Status:"
systemctl is-active nginx && echo "✅ Nginx is running" || echo "❌ Nginx is not running"

echo ""
echo "8️⃣ Port Check:"
netstat -tlnp 2>/dev/null | grep ":5050" && echo "✅ Port 5050 is listening" || echo "❌ Port 5050 not listening"
netstat -tlnp 2>/dev/null | grep ":80" && echo "✅ Port 80 is listening" || echo "❌ Port 80 not listening"

echo ""
echo "9️⃣ Recent Nginx Errors:"
tail -5 /var/log/nginx/error.log 2>/dev/null || echo "No recent errors"

echo ""
echo "🔟 Recent Backend Logs:"
pm2 logs digital-menu-backend --lines 10 --nostream 2>/dev/null || echo "No logs available"

echo ""
echo "====================="
echo "Check complete!"
