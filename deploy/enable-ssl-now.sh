#!/bin/bash
# Quick SSL enablement script
# Run on your VPS: curl -sSL https://raw.githubusercontent.com/ibrahim362-ai/digital_menu/main/deploy/enable-ssl-now.sh | sudo bash

set -e

echo "🔒 Quick SSL Setup for simoo.skoolific.com"
echo "=================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root"
    exit 1
fi

# Navigate to project
cd /var/www/digital_menu || {
    echo "❌ Project not found at /var/www/digital_menu"
    echo "Run: cd /var/www && git clone https://github.com/ibrahim362-ai/digital_menu.git"
    exit 1
}

# Make scripts executable
chmod +x deploy/*.sh

# Run SSL setup
./deploy/setup-ssl.sh

# Verify SSL is working
echo ""
echo "🔍 Verifying SSL installation..."
sleep 3

if curl -s -I https://simoo.skoolific.com | grep -q "HTTP/2 200\|HTTP/1.1 200"; then
    echo "✅ SSL is working! Your site is now secure."
else
    echo "⚠️  SSL installed but verification failed. Check manually."
fi

echo ""
echo "=================================================="
echo "🎉 Setup Complete!"
echo "=================================================="
echo ""
echo "🌐 Visit: https://simoo.skoolific.com"
echo "🔒 Your site is now secure (HTTPS enabled)"
echo ""
echo "📝 Next steps:"
echo "   1. Clear your browser cache"
echo "   2. Visit https://simoo.skoolific.com"
echo "   3. The 'Not secure' warning should be gone"
echo ""
