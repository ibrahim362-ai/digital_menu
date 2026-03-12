#!/bin/bash

echo "🔧 Updating frontend environment configuration..."

cd /var/www/digital_menu/frontend

# Create .env for production
cat > .env << 'EOF'
VITE_API_URL=/api
EOF

echo "✅ Frontend .env updated to use relative API URL"
echo "This will work with both HTTP and HTTPS"

# Rebuild frontend
echo "🏗️  Rebuilding frontend..."
npm run build

# Deploy
echo "📦 Deploying frontend..."
rm -rf /var/www/html/digital-menu/*
cp -r dist/* /var/www/html/digital-menu/

# Fix permissions
chown -R www-data:www-data /var/www/html/digital-menu
chmod -R 755 /var/www/html/digital-menu

echo "✅ Frontend updated and deployed!"
