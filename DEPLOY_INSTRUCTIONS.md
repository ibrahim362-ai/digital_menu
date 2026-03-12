# 🚀 Quick Deployment Instructions

## On Your Local Machine

1. **Commit and push the deployment scripts:**
```bash
git add deploy/
git commit -m "Add deployment scripts"
git push origin main
```

## On Your VPS (76.13.48.245)

2. **Connect to your VPS:**
```bash
ssh root@76.13.48.245
```

3. **Clone the repository:**
```bash
cd /var/www
git clone https://github.com/ibrahim362-ai/digital_menu.git
cd digital_menu
```

4. **Make scripts executable:**
```bash
chmod +x deploy/*.sh
```

5. **Run the automated deployment:**
```bash
./deploy/deploy-all-auto.sh
```

**OR for interactive mode (recommended for first-time):**
```bash
./deploy/deploy-all.sh
```

## What the Script Does

The automated script will:
- ✅ Install Node.js, PM2, Nginx, PostgreSQL
- ✅ Create database with secure password
- ✅ Setup backend with auto-generated JWT secrets
- ✅ Build and deploy frontend
- ✅ Configure Nginx
- ✅ Start backend with PM2
- ✅ Configure firewall

## After Deployment

1. **Access your site:**
   - http://simoo.skoolific.com

2. **Login to admin:**
   - URL: http://simoo.skoolific.com/admin/login
   - Email: admin@example.com
   - Password: admin123
   - ⚠️ **CHANGE THIS PASSWORD IMMEDIATELY!**

3. **Setup SSL (recommended):**
```bash
./deploy/setup-ssl.sh
```

4. **Setup automated backups:**
```bash
crontab -e
# Add this line for daily backups at 2 AM:
0 2 * * * /var/www/digital_menu/deploy/backup.sh
```

## Maintenance Commands

```bash
# View logs
pm2 logs restaurant-backend

# Restart backend
pm2 restart restaurant-backend

# Update application
./deploy/update.sh

# Create backup
./deploy/backup.sh

# Check status
pm2 status
systemctl status nginx
```

## Troubleshooting

If something goes wrong:

```bash
# Check backend logs
pm2 logs restaurant-backend

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Check if backend is running
pm2 status

# Restart services
pm2 restart restaurant-backend
systemctl restart nginx
```

## Manual Deployment (Step by Step)

If you prefer to run each step manually:

```bash
./deploy/install.sh              # Install software
./deploy/setup-database.sh       # Create database
./deploy/setup-backend.sh        # Setup backend
./deploy/setup-frontend.sh       # Setup frontend
./deploy/setup-nginx.sh          # Configure Nginx
./deploy/start-backend.sh        # Start backend
./deploy/setup-firewall.sh       # Configure firewall
./deploy/setup-ssl.sh            # Setup SSL
```

## Support

For detailed information, see:
- `deploy/DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `deploy/README.md` - Scripts overview

---

**Ready to deploy? Push your code and run the script on your VPS!** 🚀
