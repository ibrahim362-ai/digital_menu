#!/bin/bash
set -e

echo "🔒 Setting up SSL certificate..."
echo "=================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root: sudo ./deploy/setup-ssl.sh"
    exit 1
fi

# Check if domain is accessible
echo "1️⃣  Checking domain accessibility..."
if ! curl -s -o /dev/null -w "%{http_code}" http://simoo.skoolific.com | grep -q "200\|301\|302"; then
    echo "⚠️  Warning: Domain might not be properly configured"
    echo "Make sure simoo.skoolific.com points to this server's IP"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install Certbot
echo ""
echo "2️⃣  Installing Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
echo ""
echo "3️⃣  Obtaining SSL certificate..."
certbot --nginx -d simoo.skoolific.com --non-interactive --agree-tos --email admin@simoo.skoolific.com --redirect

# Verify certificate
echo ""
echo "4️⃣  Verifying SSL certificate..."
if [ -f "/etc/letsencrypt/live/simoo.skoolific.com/fullchain.pem" ]; then
    echo "✅ SSL certificate installed successfully!"
    openssl x509 -in /etc/letsencrypt/live/simoo.skoolific.com/fullchain.pem -noout -dates
else
    echo "❌ SSL certificate not found"
    exit 1
fi

# Test auto-renewal
echo ""
echo "5️⃣  Testing auto-renewal..."
certbot renew --dry-run

# Restart nginx
echo ""
echo "6️⃣  Restarting Nginx..."
systemctl restart nginx

echo ""
echo "=================================================="
echo "✅ SSL Setup Complete!"
echo "=================================================="
echo ""
echo "🌐 Your site is now secure:"
echo "   https://simoo.skoolific.com"
echo ""
echo "🔄 Certificate will auto-renew before expiration"
echo ""
echo "📝 Certificate details:"
certbot certificates
echo ""
