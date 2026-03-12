#!/bin/bash
set -e

echo "🚀 Starting backend with PM2..."

cd /var/www/digital_menu/backend

# Set permissions for uploads
chown -R www-data:www-data uploads
chmod -R 755 uploads

# Start the application
pm2 start server.js --name "restaurant-backend"

# Save PM2 configuration
pm2 save
pm2 startup

# Show status
pm2 status

echo "✅ Backend started successfully!"
echo "📊 View logs with: pm2 logs restaurant-backend"
