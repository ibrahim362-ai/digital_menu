#!/bin/bash
set -e

echo "🔄 Updating application..."

cd /var/www/digital_menu

# Pull latest changes
git pull origin main

# Update backend
echo "📦 Updating backend..."
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
pm2 restart restaurant-backend

# Update frontend
echo "🎨 Updating frontend..."
cd ../frontend
npm install
npm run build
cp -r dist/* /var/www/html/simoo.skoolific.com/

echo "✅ Application updated successfully!"
pm2 status
