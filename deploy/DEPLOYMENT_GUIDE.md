# 🚀 Restaurant Management System - Deployment Guide

## Prerequisites
- VPS with Ubuntu/Debian
- Root access
- Domain: simoo.skoolific.com pointing to your VPS IP (76.13.48.245)

## Quick Deployment

### 1. Connect to VPS
```bash
ssh root@76.13.48.245
```

### 2. Clone Repository
```bash
cd /var/www
git clone https://github.com/ibrahim362-ai/digital_menu.git
cd digital_menu
```

### 3. Run Installation Scripts

Make scripts executable:
```bash
chmod +x deploy/*.sh
```

Run in order:
```bash
# Install required software
./deploy/install.sh

# Setup database
./deploy/setup-database.sh
# ⚠️ SAVE THE DATABASE PASSWORD!

# Setup backend
./deploy/setup-backend.sh
# ⚠️ Edit backend/.env and update DATABASE_URL with the password

# Setup frontend
./deploy/setup-frontend.sh

# Configure Nginx
./deploy/setup-nginx.sh

# Start backend
./deploy/start-backend.sh

# Setup firewall
./deploy/setup-firewall.sh

# Setup SSL (optional but recommended)
./deploy/setup-ssl.sh
```

## Verification

### Check Backend
```bash
curl http://localhost:5050/api/health
pm2 logs restaurant-backend
```

### Check Frontend
```bash
ls -la /var/www/html/simoo.skoolific.com/
```

### Check Nginx
```bash
systemctl status nginx
tail -f /var/log/nginx/error.log
```

## Access Your Application

- Website: https://simoo.skoolific.com
- Admin Login: https://simoo.skoolific.com/admin/login

Default credentials (from seed.js):
- Email: admin@example.com
- Password: admin123

⚠️ **Change the default password immediately!**

## Maintenance Commands

### Update Application
```bash
./deploy/update.sh
```

### Create Backup
```bash
./deploy/backup.sh
```

### View Logs
```bash
pm2 logs restaurant-backend
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Restart Services
```bash
pm2 restart restaurant-backend
systemctl restart nginx
```

### Monitor System
```bash
pm2 status
htop
df -h
```

## Troubleshooting

### Backend not starting
```bash
cd /var/www/digital_menu/backend
pm2 logs restaurant-backend
# Check .env file configuration
cat .env
```

### Database connection issues
```bash
# Test database connection
sudo -u postgres psql -d restaurant_db -c "SELECT 1;"
# Check DATABASE_URL in backend/.env
```

### Nginx errors
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### Permission issues
```bash
chown -R www-data:www-data /var/www/html/simoo.skoolific.com
chown -R www-data:www-data /var/www/digital_menu/backend/uploads
chmod -R 755 /var/www/html/simoo.skoolific.com
chmod -R 755 /var/www/digital_menu/backend/uploads
```

## Security Checklist

- [ ] Change default admin password
- [ ] Setup SSL certificate
- [ ] Configure firewall
- [ ] Setup automated backups
- [ ] Update JWT secrets in .env
- [ ] Restrict database access
- [ ] Enable fail2ban (optional)
- [ ] Setup monitoring (optional)

## Automated Backups

Add to crontab for daily backups at 2 AM:
```bash
crontab -e
# Add this line:
0 2 * * * /var/www/digital_menu/deploy/backup.sh
```

## Support

For issues or questions, check:
- Application logs: `pm2 logs restaurant-backend`
- Nginx logs: `/var/log/nginx/error.log`
- System logs: `journalctl -xe`
