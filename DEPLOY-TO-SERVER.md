# 🚀 Deploy to Your Server (76.13.48.245)

## Quick Deploy - Copy & Paste These Commands

### Step 1: SSH into your server
```bash
ssh root@76.13.48.245
```

### Step 2: Download and run deployment script
```bash
curl -o deploy.sh https://raw.githubusercontent.com/ibrahim362-ai/digital_menu/main/SERVER-DEPLOY.sh
chmod +x deploy.sh
./deploy.sh
```

That's it! The script will automatically:
- ✅ Install Node.js, PostgreSQL, Nginx, PM2
- ✅ Clone your repository
- ✅ Set up database
- ✅ Configure environment variables
- ✅ Run migrations and seed data
- ✅ Generate SEO slugs
- ✅ Build and deploy frontend
- ✅ Configure Nginx
- ✅ Set up firewall
- ✅ Start everything

## Or Manual Deployment

If you prefer manual control:

```bash
# 1. SSH into server
ssh root@76.13.48.245

# 2. Clone repository
git clone https://github.com/ibrahim362-ai/digital_menu.git
cd digital_menu

# 3. Run deployment scripts
chmod +x deploy/*.sh
./deploy/deploy-all.sh

# 4. Apply SEO migration
cd backend
npx prisma migrate deploy
node generate-slugs.js
pm2 restart restaurant-backend
```

## After Deployment

Your site will be live at:
- **Frontend:** http://76.13.48.245
- **Admin Panel:** http://76.13.48.245/admin
- **Backend API:** http://76.13.48.245:5000

### Default Admin Login
- Email: `admin@restaurant.com`
- Password: `admin123`

**⚠️ CHANGE THIS PASSWORD IMMEDIATELY!**

## Useful Commands

```bash
# Check backend status
pm2 status

# View backend logs
pm2 logs restaurant-backend

# Restart backend
pm2 restart restaurant-backend

# Check Nginx status
systemctl status nginx

# Restart Nginx
systemctl restart nginx

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

## Update Your Application

```bash
cd /root/digital_menu
git pull origin main

# Update backend
cd backend
npm install
npx prisma migrate deploy
pm2 restart restaurant-backend

# Update frontend
cd ../frontend
npm install
npm run build
```

## Add Custom Domain (Optional)

If you have a domain name:

1. Point your domain's A record to: `76.13.48.245`

2. Update Nginx config:
```bash
nano /etc/nginx/sites-available/digital-menu
# Change server_name to your domain
systemctl restart nginx
```

3. Install SSL certificate:
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

## Troubleshooting

### Backend won't start
```bash
pm2 logs restaurant-backend
# Check for errors
```

### Database connection failed
```bash
sudo -u postgres psql
\l  # List databases
\du # List users
```

### Nginx errors
```bash
nginx -t  # Test configuration
tail -f /var/log/nginx/error.log
```

### Port already in use
```bash
lsof -i :5000  # Check what's using port 5000
pm2 delete all
pm2 start backend/server.js --name restaurant-backend
```

## Security Checklist

- [ ] Change default admin password
- [ ] Update database password in .env
- [ ] Set strong JWT_SECRET
- [ ] Enable firewall (UFW)
- [ ] Install SSL certificate
- [ ] Set up automatic backups
- [ ] Keep system updated

## Backup Your Data

```bash
# Backup database
pg_dump -U restaurant_user restaurant_db > backup.sql

# Backup uploads
tar -czf uploads-backup.tar.gz /root/digital_menu/backend/uploads
```

## Need Help?

Check the logs first:
```bash
pm2 logs restaurant-backend
tail -f /var/log/nginx/error.log
```

---

**Ready to deploy?** Just SSH in and run the deployment script! 🚀
