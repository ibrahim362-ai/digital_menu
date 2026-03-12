#!/bin/bash
set -e

BACKUP_DIR="/var/backups/restaurant"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 Creating backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
echo "📊 Backing up database..."
sudo -u postgres pg_dump restaurant_db > $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploads
echo "📁 Backing up uploads..."
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/www/digital_menu/backend/uploads

# Backup .env files
echo "⚙️ Backing up configuration..."
cp /var/www/digital_menu/backend/.env $BACKUP_DIR/backend_env_$DATE
cp /var/www/digital_menu/frontend/.env $BACKUP_DIR/frontend_env_$DATE

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "✅ Backup completed: $BACKUP_DIR"
ls -lh $BACKUP_DIR
