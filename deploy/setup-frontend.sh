#!/bin/bash
set -e

echo "🎨 Setting up frontend..."

cd /var/www/digital_menu/frontend

# Install dependencies
npm install

# Create production .env
echo 'VITE_API_URL=https://simoo.skoolific.com/api' > .env

# Build the frontend
npm run build

# Create web directory and copy files
mkdir -p /var/www/html/simoo.skoolific.com
cp -r dist/* /var/www/html/simoo.skoolific.com/

# Set permissions
chown -R www-data:www-data /var/www/html/simoo.skoolific.com
chmod -R 755 /var/www/html/simoo.skoolific.com

echo "✅ Frontend setup complete!"
