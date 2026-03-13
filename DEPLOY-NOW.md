# 🚀 Deploy to Server NOW

## Your Server: 76.13.48.245

All code is pushed to GitHub. Now deploy to your server:

---

## Option 1: Automated Update (Recommended)

### Copy and paste these commands:

```bash
# SSH into your server
ssh root@76.13.48.245

# Download update script
curl -o update.sh https://raw.githubusercontent.com/ibrahim362-ai/digital_menu/main/UPDATE-SERVER.sh

# Make it executable
chmod +x update.sh

# Run update
./update.sh
```

**Done in 2-3 minutes!** ✨

---

## Option 2: Manual Update

```bash
# SSH into server
ssh root@76.13.48.245

# Navigate to project
cd /root/digital_menu

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install
npx prisma migrate deploy
node seed-seo.js
node generate-slugs.js
pm2 restart restaurant-backend

# Update frontend
cd ../frontend
npm install
npm run build

# Restart Nginx
sudo systemctl restart nginx
```

---

## Option 3: Fresh Installation

If this is your first deployment:

```bash
# SSH into server
ssh root@76.13.48.245

# Download deployment script
curl -o deploy.sh https://raw.githubusercontent.com/ibrahim362-ai/digital_menu/main/SERVER-DEPLOY.sh

# Make it executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

---

## After Deployment

### Your site will be live at:
- **Frontend**: http://76.13.48.245
- **Admin Panel**: http://76.13.48.245/admin

### Login Credentials:
- **Email**: ibrahimkamil362@gmail.com
- **Password**: Admin@123

⚠️ **Change password immediately after login!**

---

## What's New (SEO Features)

✅ **SEO-Friendly URLs**
- Categories: `/menu/beverages`
- Products: `/menu/beverages/ethiopian-coffee`

✅ **Location-Based SEO**
- Pre-configured for Simoo Cafe
- Location: Dire Dawa, Ethiopia
- Keywords: "Cafe Dire Dawa, ethiopia, simoo cafe..."

✅ **Meta Tags**
- Search engine optimized
- Social media sharing ready
- Open Graph tags

✅ **Auto Browser Title**
- "Simoo Cafe - Dire Dawa, Ethiopia"

---

## Verify Deployment

### Check Backend Status
```bash
pm2 status
pm2 logs restaurant-backend
```

### Check Frontend
Open in browser: http://76.13.48.245

### Check SEO
1. View page source (Ctrl+U)
2. Look for meta tags with "Simoo Cafe" and "Dire Dawa"

### Check Admin Panel
1. Go to http://76.13.48.245/admin
2. Login
3. Go to Settings tab
4. Verify SEO fields are visible

---

## Troubleshooting

### Backend won't start
```bash
pm2 logs restaurant-backend
# Check for errors
```

### Frontend not updating
```bash
cd /root/digital_menu/frontend
npm run build
sudo systemctl restart nginx
```

### Database migration failed
```bash
cd /root/digital_menu/backend
npx prisma migrate reset
npx prisma migrate deploy
node seed.js
```

### Can't connect to server
- Check if server is running
- Verify IP address: 76.13.48.245
- Check firewall: `sudo ufw status`

---

## Quick Commands Reference

```bash
# Check status
pm2 status

# View logs
pm2 logs restaurant-backend

# Restart backend
pm2 restart restaurant-backend

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# View Nginx errors
tail -f /var/log/nginx/error.log
```

---

## Need Help?

1. Check logs: `pm2 logs restaurant-backend`
2. Check Nginx: `sudo systemctl status nginx`
3. Verify database: `cd backend && npx prisma studio`

---

**Ready? Just copy the commands from Option 1 and paste into your terminal!** 🚀

Repository: https://github.com/ibrahim362-ai/digital_menu.git
