#!/bin/bash
set -e

echo "🚀 Installing required software..."

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 and Nginx
npm install -g pm2
apt install -y nginx git

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Verify installations
echo "✅ Installed versions:"
node --version
npm --version
pm2 --version
nginx -v

echo "✅ Installation complete!"
