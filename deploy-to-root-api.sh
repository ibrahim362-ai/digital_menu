#!/bin/bash

echo "🚀 Deploying to /root/api"
echo "========================="

# Create /root/api directory
mkdir -p /root/api
cd /root/api

# Clone or update repository
if [ -d ".git" ]; then
    echo "📥 Updating existing repository..."
    git pull origin main
else
    echo "📥 Cloning repository..."
    cd /root
    rm -rf api
    git clone https://github.com/ibrahim362-ai/digital_menu.git api
    cd api
fi

# Copy backend files to /root/api if needed
if [ -d "backend" ]; then
    echo "📦 Setting up backend..."
    cp -r backend/* /root/api/
    cd /root/api
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file
echo "⚙️  Creating .env file..."
cat > .env << 'EOF'
DATABASE_URL="postgresql://simoo:O@76.13.48.245:3600/A?schema=public"
JWT_SECRET="6324e4bcbccc693459619dacecd49be7653341ad48e9da4d76e7f7ba9719b63e"
JWT_REFRESH_SECRET="579c1333f3636f257a084a359349b2cc6975cb77af20809c6b84503e98203b19"
NODE_ENV="production"
CORS_ORIGIN="http://simoo.skoolific.com,https://simoo.skoolific.com,http://76.13.48.245"
PORT=5050
EOF

# Check if server.js exists, if not create it
if [ ! -f "server.js" ]; then
    echo "📝 Creating server.js..."
    if [ -f "src/app.js" ]; then
        ln -s src/app.js server.js
    else
        echo "❌ No app.js found!"
        exit 1
    fi
fi

# Run Prisma migrations
echo "📊 Running database migrations..."
npx prisma generate
npx prisma migrate deploy

# Stop any existing process on port 5050
echo "🛑 Stopping existing processes..."
pm2 delete digital-menu-backend 2>/dev/null || true
lsof -ti:5050 | xargs kill -9 2>/dev/null || true

# Start the server with PM2
echo "🚀 Starting server..."
pm2 start server.js --name "digital-menu-backend" --node-args="--max-old-space-size=2048"
pm2 save
pm2 startup

echo ""
echo "✅ Backend deployed successfully!"
echo ""
echo "📊 Status:"
pm2 status

echo ""
echo "🔍 Testing backend..."
sleep 2
curl -s http://localhost:5050/api/health && echo " ✅ Backend is healthy" || echo " ❌ Backend not responding"

echo ""
echo "📝 Useful commands:"
echo "   cd /root/api"
echo "   npm install"
echo "   node server.js          # Run directly"
echo "   pm2 logs digital-menu-backend  # View logs"
echo "   pm2 restart digital-menu-backend  # Restart"
echo ""
