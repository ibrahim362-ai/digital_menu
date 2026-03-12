#!/bin/bash
set -e

echo "🔧 Complete Fix for 403 Forbidden Error"
echo "=================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root: sudo ./deploy/complete-fix.sh"
    exit 1
fi

# Check if in correct directory
if [ ! -d "/var/www/digital_menu" ]; then
    echo "❌ Repository not found at /var/www/digital_menu"
    echo "Run: cd /var/www && git clone https://github.com/ibrahim362-ai/digital_menu.git"
    exit 1
fi

cd /var/www/digital_menu

# Step 1: Build frontend
echo "1️⃣  Building frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo 'VITE_API_URL=/api' > .env
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist folder not created"
    exit 1
fi

echo "✅ Frontend built successfully"
echo ""

# Step 2: Deploy frontend
echo "2️⃣  Deploying frontend files..."
mkdir -p /var/www/html/simoo.skoolific.com
rm -rf /var/www/html/simoo.skoolific.com/*
cp -r dist/* /var/www/html/simoo.skoolific.com/

echo "Files deployed:"
ls -lh /var/www/html/simoo.skoolific.com/
echo ""

# Step 3: Set permissions
echo "3️⃣  Setting permissions..."
chown -R www-data:www-data /var/www/html/simoo.skoolific.com
chmod -R 755 /var/www/html/simoo.skoolific.com
echo "✅ Permissions set"
echo ""

# Step 4: Setup backend if not done
echo "4️⃣  Checking backend..."
cd /var/www/digital_menu/backend

if [ ! -f ".env" ]; then
    echo "⚠️  Backend .env not found. Creating template..."
    cat > .env << 'EOF'
DATABASE_URL="postgresql://restaurant_user:YOUR_PASSWORD@localhost:5432/restaurant_db?schema=public"
JWT_SECRET="CHANGE_THIS_SECRET"
JWT_REFRESH_SECRET="CHANGE_THIS_REFRESH_SECRET"
NODE_ENV="production"
CORS_ORIGIN="http://simoo.skoolific.com"
PORT=5050
EOF
    echo "❌ Please update backend/.env with correct credentials"
    echo "Then run: ./deploy/start-backend.sh"
else
    echo "✅ Backend .env exists"
    
    # Check if backend is running
    if pm2 list | grep -q "restaurant-backend"; then
        echo "Restarting backend..."
        pm2 restart restaurant-backend
    else
        echo "Starting backend..."
        if [ ! -d "node_modules" ]; then
            npm install
        fi
        npx prisma generate
        pm2 start server.js --name restaurant-backend
        pm2 save
    fi
fi
echo ""

# Step 5: Configure Nginx
echo "5️⃣  Configuring Nginx..."
cd /var/www/digital_menu

if [ ! -f "/etc/nginx/sites-enabled/simoo.skoolific.com" ]; then
    echo "Creating Nginx configuration..."
    cp deploy/nginx-config.conf /etc/nginx/sites-available/simoo.skoolific.com
    ln -sf /etc/nginx/sites-available/simoo.skoolific.com /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
fi

nginx -t
systemctl restart nginx
echo "✅ Nginx configured and restarted"
echo ""

# Step 6: Test everything
echo "6️⃣  Testing services..."
sleep 3

echo "Backend test:"
if curl -s http://localhost:5050/api/health > /dev/null 2>&1; then
    echo "✅ Backend is responding"
    curl -s http://localhost:5050/api/health
else
    echo "❌ Backend is NOT responding"
    echo "Check logs: pm2 logs restaurant-backend"
fi
echo ""

echo "Frontend test:"
if curl -s http://localhost:80 | grep -q "<!doctype html>"; then
    echo "✅ Frontend is being served"
else
    echo "❌ Frontend is NOT being served"
    echo "Check logs: tail -f /var/log/nginx/error.log"
fi
echo ""

echo "API proxy test:"
if curl -s http://localhost:80/api/health > /dev/null 2>&1; then
    echo "✅ API proxy is working"
else
    echo "⚠️  API proxy might not be working"
fi
echo ""

# Step 7: Show status
echo "=================================================="
echo "✅ Fix Complete!"
echo "=================================================="
echo ""
echo "📊 Current Status:"
pm2 status
echo ""
echo "🌐 Access your site:"
echo "   http://simoo.skoolific.com"
echo ""
echo "🔑 Default admin login:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "📝 Next steps:"
echo "   1. Test: http://simoo.skoolific.com"
echo "   2. Setup SSL: ./deploy/setup-ssl.sh"
echo "   3. Change admin password"
echo ""
