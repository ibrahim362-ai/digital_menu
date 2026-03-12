#!/bin/bash
set -e

echo "🔥 Configuring firewall..."

# Allow necessary ports
ufw allow 22/tcp        # SSH
ufw allow 80/tcp        # HTTP
ufw allow 443/tcp       # HTTPS

# Enable firewall
ufw --force enable

# Check status
ufw status

echo "✅ Firewall configured successfully!"
