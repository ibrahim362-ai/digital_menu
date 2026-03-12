#!/bin/bash

echo "🔒 Setting up SSL certificate for simoo.skoolific.com..."

# First, let's set up HTTP (port 80) properly
echo "📝 Configuring Nginx for HTTP first..."

cat > /etc/nginx/sites-available/digital-menu << 'EOF'
server {
    listen 80;
    server_name simoo.skoolific.com;

    root /var/www/html/digital-menu;
    index index.html;

    # Frontend - serve static files
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5050/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend uploads
    location /uploads/ {
        proxy_pass http://localhost:5050/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration error"
    exit 1
fi

systemctl reload nginx

echo "✅ HTTP configuration complete"
echo ""
echo "🔒 Now setting up SSL certificate..."
echo ""

# Install Certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Stop Nginx temporarily for standalone certificate
systemctl stop nginx

# Get SSL certificate using standalone mode
echo "📜 Obtaining SSL certificate..."
certbot certonly --standalone \
    -d simoo.skoolific.com \
    --non-interactive \
    --agree-tos \
    --email admin@simoo.skoolific.com \
    --preferred-challenges http

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate obtained successfully"
    
    # Update Nginx configuration with SSL
    cat > /etc/nginx/sites-available/digital-menu << 'EOF'
server {
    listen 80;
    server_name simoo.skoolific.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name simoo.skoolific.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/simoo.skoolific.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/simoo.skoolific.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /var/www/html/digital-menu;
    index index.html;

    # Frontend - serve static files
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5050/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend uploads
    location /uploads/ {
        proxy_pass http://localhost:5050/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

    # Test and start Nginx
    nginx -t
    systemctl start nginx
    
    # Set up auto-renewal
    echo "🔄 Setting up automatic certificate renewal..."
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
    
    echo ""
    echo "✅ SSL setup complete!"
    echo "🌐 Your site is now available at: https://simoo.skoolific.com"
    
else
    echo "❌ Failed to obtain SSL certificate"
    echo ""
    echo "⚠️  Starting Nginx with HTTP only..."
    systemctl start nginx
    echo ""
    echo "Please check:"
    echo "  1. DNS is pointing to this server (76.13.48.245)"
    echo "  2. Port 80 and 443 are open in firewall"
    echo "  3. Domain is accessible from internet"
    echo ""
    echo "You can access via HTTP: http://simoo.skoolific.com"
fi
