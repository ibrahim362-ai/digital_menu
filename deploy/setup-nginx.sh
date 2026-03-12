#!/bin/bash
set -e

echo "🌐 Configuring Nginx..."

# Copy Nginx configuration
cp /var/www/digital_menu/deploy/nginx-config.conf /etc/nginx/sites-available/simoo.skoolific.com

# Enable site
ln -sf /etc/nginx/sites-available/simoo.skoolific.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx

echo "✅ Nginx configured successfully!"
