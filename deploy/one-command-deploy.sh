#!/bin/bash
# One-command deployment script
# Usage: curl -sSL https://raw.githubusercontent.com/ibrahim362-ai/digital_menu/main/deploy/one-command-deploy.sh | bash

set -e

echo "🚀 One-Command Restaurant Management System Deployment"
echo "=================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root: sudo bash"
    exit 1
fi

# Clone repository if not exists
if [ ! -d "/var/www/digital_menu" ]; then
    echo "📥 Cloning repository..."
    mkdir -p /var/www
    cd /var/www
    git clone https://github.com/ibrahim362-ai/digital_menu.git
    cd digital_menu
else
    echo "📂 Repository already exists, pulling latest..."
    cd /var/www/digital_menu
    git pull origin main
fi

# Make scripts executable
chmod +x deploy/*.sh

# Run complete fix
./deploy/complete-fix.sh

echo ""
echo "=================================================="
echo "🎉 Deployment Complete!"
echo "=================================================="
echo ""
echo "Visit: http://simoo.skoolific.com"
echo ""
