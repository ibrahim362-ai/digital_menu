#!/bin/bash

echo "🧪 Manual Testing Script"
echo "=================================================="
echo ""

echo "1️⃣  Testing Nginx status..."
systemctl status nginx --no-pager | head -n 10
echo ""

echo "2️⃣  Testing backend health endpoint..."
echo "Request: curl http://localhost:5050/api/health"
curl -v http://localhost:5050/api/health 2>&1 | head -n 20
echo ""

echo "3️⃣  Testing Nginx on port 80..."
echo "Request: curl http://localhost:80"
curl -I http://localhost:80 2>&1 | head -n 15
echo ""

echo "4️⃣  Checking frontend files..."
echo "Directory: /var/www/html/simoo.skoolific.com/"
ls -lah /var/www/html/simoo.skoolific.com/ 2>&1 | head -n 20
echo ""

echo "5️⃣  Checking Nginx configuration..."
nginx -t
echo ""

echo "6️⃣  Checking active Nginx sites..."
ls -la /etc/nginx/sites-enabled/
echo ""

echo "7️⃣  Checking PM2 processes..."
pm2 list
echo ""

echo "8️⃣  Checking listening ports..."
netstat -tuln | grep -E ':(80|443|5050|5432) '
echo ""

echo "9️⃣  Checking backend .env file..."
if [ -f "/var/www/digital_menu/backend/.env" ]; then
    echo "✅ .env file exists"
    echo "Contents (sensitive data hidden):"
    cat /var/www/digital_menu/backend/.env | sed 's/=.*/=***HIDDEN***/g'
else
    echo "❌ .env file NOT found"
fi
echo ""

echo "🔟 Recent Nginx error logs..."
tail -n 10 /var/log/nginx/error.log 2>/dev/null || echo "No error logs found"
echo ""

echo "=================================================="
echo "Testing complete!"
echo "=================================================="
