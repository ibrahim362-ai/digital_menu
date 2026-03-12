#!/bin/bash

echo "🔍 Restaurant Management System - Status Check"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_service() {
    if systemctl is-active --quiet $1; then
        echo -e "${GREEN}✓${NC} $1 is running"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT running"
        return 1
    fi
}

check_port() {
    if netstat -tuln | grep -q ":$1 "; then
        echo -e "${GREEN}✓${NC} Port $1 is listening"
        return 0
    else
        echo -e "${RED}✗${NC} Port $1 is NOT listening"
        return 1
    fi
}

check_file() {
    if [ -f "$1" ] || [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NOT found"
        return 1
    fi
}

# Check services
echo "📊 Service Status:"
echo "-------------------"
check_service nginx
check_service postgresql
echo ""

# Check PM2
echo "🔄 PM2 Status:"
echo "-------------------"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✓${NC} PM2 is installed"
    pm2 list
else
    echo -e "${RED}✗${NC} PM2 is NOT installed"
fi
echo ""

# Check ports
echo "🔌 Port Status:"
echo "-------------------"
check_port 80    # Nginx HTTP
check_port 443   # Nginx HTTPS
check_port 5050  # Backend API
check_port 5432  # PostgreSQL
echo ""

# Check files and directories
echo "📁 File System:"
echo "-------------------"
check_file "/var/www/digital_menu"
check_file "/var/www/digital_menu/backend"
check_file "/var/www/digital_menu/frontend"
check_file "/var/www/html/simoo.skoolific.com"
check_file "/var/www/digital_menu/backend/.env"
check_file "/var/www/digital_menu/backend/node_modules"
check_file "/etc/nginx/sites-enabled/simoo.skoolific.com"
echo ""

# Check frontend files
echo "🎨 Frontend Files:"
echo "-------------------"
if [ -d "/var/www/html/simoo.skoolific.com" ]; then
    FILE_COUNT=$(ls -1 /var/www/html/simoo.skoolific.com | wc -l)
    echo -e "${GREEN}✓${NC} Frontend directory has $FILE_COUNT files/folders"
    ls -lh /var/www/html/simoo.skoolific.com
else
    echo -e "${RED}✗${NC} Frontend directory not found"
fi
echo ""

# Test backend API
echo "🔧 Backend API Test:"
echo "-------------------"
if curl -s http://localhost:5050/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend API is responding"
    curl -s http://localhost:5050/api/health | head -n 5
else
    echo -e "${RED}✗${NC} Backend API is NOT responding"
fi
echo ""

# Test Nginx
echo "🌐 Nginx Test:"
echo "-------------------"
if curl -s http://localhost:80 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Nginx is serving content"
else
    echo -e "${RED}✗${NC} Nginx is NOT responding"
fi

# Test Nginx configuration
if nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓${NC} Nginx configuration is valid"
else
    echo -e "${RED}✗${NC} Nginx configuration has errors"
    nginx -t
fi
echo ""

# Check logs
echo "📋 Recent Logs:"
echo "-------------------"
echo "Backend logs (last 10 lines):"
if command -v pm2 &> /dev/null; then
    pm2 logs restaurant-backend --lines 10 --nostream 2>/dev/null || echo "No PM2 logs available"
else
    echo "PM2 not installed"
fi
echo ""

echo "Nginx error log (last 5 lines):"
if [ -f "/var/log/nginx/error.log" ]; then
    tail -n 5 /var/log/nginx/error.log
else
    echo "No Nginx error log found"
fi
echo ""

# Database check
echo "🗄️  Database Status:"
echo "-------------------"
if sudo -u postgres psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw restaurant_db; then
    echo -e "${GREEN}✓${NC} Database 'restaurant_db' exists"
else
    echo -e "${RED}✗${NC} Database 'restaurant_db' NOT found"
fi
echo ""

# System resources
echo "💻 System Resources:"
echo "-------------------"
echo "Disk usage:"
df -h / | tail -n 1
echo ""
echo "Memory usage:"
free -h | grep Mem
echo ""

# Summary
echo "=================================================="
echo "📝 Quick Actions:"
echo "=================================================="
echo ""
echo "If backend is not running:"
echo "  cd /var/www/digital_menu/backend && pm2 start server.js --name restaurant-backend"
echo ""
echo "If Nginx is not running:"
echo "  systemctl start nginx"
echo ""
echo "View detailed logs:"
echo "  pm2 logs restaurant-backend"
echo "  tail -f /var/log/nginx/error.log"
echo ""
echo "Restart services:"
echo "  pm2 restart restaurant-backend"
echo "  systemctl restart nginx"
echo ""
