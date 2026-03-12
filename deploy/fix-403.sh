#!/bin/bash
set -e

echo "🔧 Fixing 403 Forbidden Error..."
echo "=================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Step 1: Check if frontend is built
echo "1️⃣  Checking frontend build..."
if [ ! -d "/var/www/digital_menu/frontend/dist" ]; then
    echo "⚠️  Frontend not built. Building now..."
    cd /var/www/digital_menu/frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    
    # Create .env
    echo 'VITE_API_URL=http://simoo.skoolific.com/api' > .env
    
    # Build
    npm run build
    echo "✅ Frontend built"
else
    echo "✅ Frontend dist folder exists"
fi
echo ""

# Step 2: Create web directory and copy files
echo "2️⃣  Deploying frontend files..."
mkdir -p /var/www/html/simoo.skoolific.com
cp -r /var/www/digital_menu/frontend/dist/* /var/www/html/simoo.skoolific.com/
echo "✅ Files copied"
echo ""

# Step 3: Set proper permissions
echo "3️⃣  Setting permissions..."
chown -R www-data:www-data /var/www/html/simoo.skoolific.com
chmod -R 755 /var/www/html/simoo.skoolific.com
echo "✅ Permissions set"
echo ""

# Step 4: Verify files exist
echo "4️⃣  Verifying files..."
if [ -f "/var/www/html/simoo.skoolific.com/index.html" ]; then
    echo "✅ index.html found"
    ls -lh /var/www/html/simoo.skoolific.com/
else
    echo "❌ index.html NOT found!"
    echo "Directory contents:"
    ls -la /var/www/html/simoo.skoolific.com/
fi
echo ""

# Step 5: Check Nginx configuration
echo "5️⃣  Checking Nginx configuration..."
if [ -f "/etc/nginx/sites-enabled/simoo.skoolific.com" ]; then
    echo "✅ Nginx site config exists"
    nginx -t
else
    echo "⚠️  Nginx site config missing. Creating..."
    cp /var/www/digital_menu/deploy/nginx-config.conf /etc/nginx/sites-available/simoo.skoolific.com
    ln -sf /etc/nginx/sites-available/simoo.skoolific.com /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t
fi
echo ""

# Step 6: Restart Nginx
echo "6️⃣  Restarting Nginx..."
systemctl restart nginx
echo "✅ Nginx restarted"
echo ""

# Step 7: Test locally
echo "7️⃣  Testing..."
sleep 2
if curl -s http://localhost:80 | grep -q "<!doctype html>"; then
    echo "✅ Website is now accessible!"
else
    echo "⚠️  Still having issues. Checking logs..."
    tail -n 20 /var/log/nginx/error.log
fi
echo ""

echo "=================================================="
echo "✅ Fix completed!"
echo "=================================================="
echo ""
echo "Test from browser: http://simoo.skoolific.com"
echo ""
