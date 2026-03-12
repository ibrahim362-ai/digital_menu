#!/bin/bash

echo "🚀 Setting up Digital Menu in /root/api"
echo "========================================"

# Step 1: Clone repository to /root/api
echo "📥 Step 1: Cloning repository..."
cd /root
rm -rf api
git clone https://github.com/ibrahim362-ai/digital_menu.git temp_digital_menu

# Step 2: Copy backend to /root/api
echo "📦 Step 2: Setting up backend in /root/api..."
mkdir -p /root/api
cp -r temp_digital_menu/backend/* /root/api/
rm -rf temp_digital_menu

# Step 3: Install dependencies
echo "📦 Step 3: Installing dependencies..."
cd /root/api
npm install

# Step 4: Create .env
echo "⚙️  Step 4: Creating .env..."
cat > .env << 'EOF'
DATABASE_URL="postgresql://simoo:O@76.13.48.245:3600/A?schema=public"
JWT_SECRET="6324e4bcbccc693459619dacecd49be7653341ad48e9da4d76e7f7ba9719b63e"
JWT_REFRESH_SECRET="579c1333f3636f257a084a359349b2cc6975cb77af20809c6b84503e98203b19"
NODE_ENV="production"
CORS_ORIGIN="http://simoo.skoolific.com,https://simoo.skoolific.com,http://76.13.48.245"
PORT=5050
EOF

# Step 5: Run Prisma
echo "📊 Step 5: Setting up database..."
npx prisma generate
npx prisma migrate deploy

# Step 6: Create server.js if it doesn't exist
if [ ! -f "server.js" ]; then
    echo "📝 Creating server.js..."
    cat > server.js << 'EOF'
import('./src/app.js')
  .then(() => console.log('✅ Server started'))
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
EOF
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the server:"
echo "   cd /root/api"
echo "   npm install"
echo "   node server.js"
echo ""
echo "Or use PM2 for production:"
echo "   pm2 start server.js --name digital-menu-backend"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
