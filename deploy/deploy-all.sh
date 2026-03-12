#!/bin/bash
set -e

echo "🚀 Starting full deployment of Restaurant Management System..."
echo "=================================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Check if in correct directory
if [ ! -f "deploy/deploy-all.sh" ]; then
    print_error "Please run from the project root directory"
    exit 1
fi

# Step 1: Install required software
print_step "1/8 Installing required software (Node.js, PM2, Nginx, PostgreSQL)..."
./deploy/install.sh
echo ""

# Step 2: Setup database
print_step "2/8 Setting up PostgreSQL database..."
./deploy/setup-database.sh > /tmp/db_credentials.txt
cat /tmp/db_credentials.txt
echo ""
print_warning "Database credentials saved to /tmp/db_credentials.txt"
print_warning "Press Enter to continue after noting the password..."
read

# Step 3: Setup backend
print_step "3/8 Setting up backend..."
print_warning "You need to manually update backend/.env with the database password"
print_warning "Press Enter after you've updated the DATABASE_URL in backend/.env..."
read
./deploy/setup-backend.sh
echo ""

# Step 4: Setup frontend
print_step "4/8 Setting up frontend..."
./deploy/setup-frontend.sh
echo ""

# Step 5: Configure Nginx
print_step "5/8 Configuring Nginx..."
./deploy/setup-nginx.sh
echo ""

# Step 6: Start backend
print_step "6/8 Starting backend with PM2..."
./deploy/start-backend.sh
echo ""

# Step 7: Setup firewall
print_step "7/8 Configuring firewall..."
./deploy/setup-firewall.sh
echo ""

# Step 8: Setup SSL (optional)
print_step "8/8 Setting up SSL certificate..."
print_warning "Do you want to setup SSL certificate now? (y/n)"
read -r setup_ssl
if [ "$setup_ssl" = "y" ] || [ "$setup_ssl" = "Y" ]; then
    ./deploy/setup-ssl.sh
else
    print_warning "Skipping SSL setup. You can run ./deploy/setup-ssl.sh later"
fi
echo ""

# Final verification
echo "=================================================="
echo "✅ Deployment Complete!"
echo "=================================================="
echo ""
echo "📊 System Status:"
echo "----------------"
pm2 status
echo ""
systemctl status nginx --no-pager
echo ""
echo "🌐 Your application should be accessible at:"
echo "   http://simoo.skoolific.com"
if [ "$setup_ssl" = "y" ] || [ "$setup_ssl" = "Y" ]; then
    echo "   https://simoo.skoolific.com"
fi
echo ""
echo "🔑 Default Admin Credentials:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo "   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!"
echo ""
echo "📝 Useful Commands:"
echo "   View logs: pm2 logs restaurant-backend"
echo "   Restart backend: pm2 restart restaurant-backend"
echo "   Update app: ./deploy/update.sh"
echo "   Create backup: ./deploy/backup.sh"
echo ""
echo "📄 Database credentials saved in: /tmp/db_credentials.txt"
echo ""
