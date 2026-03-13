# 🚀 Deploy Simoo Cafe to https://simoo.skoolific.com

## Quick Deploy - 3 Commands

### Step 1: Connect to Server
```bash
ssh root@76.13.48.245
```
Password: `-u)HmA@W@ion9g)TuJ4Zh`

### Step 2: Download and Run Deployment Script
```bash
curl -o deploy-simoo.sh https://raw.githubusercontent.com/ibrahim362-ai/digital_menu/main/DEPLOY-SIMOO-CAFE.sh
chmod +x deploy-simoo.sh
./deploy-simoo.sh
```

### Step 3: Install SSL Certificate
```bash
certbot --nginx -d simoo.skoolific.com -d www.simoo.skoolific.com
```

**Done!** Your site will be live at https://simoo.skoolific.com 🎉

---

## What This Does

✅ Installs Node.js, PostgreSQL, Nginx, PM2  
✅ Clones your GitHub repository  
✅ Sets up database with Simoo Cafe data  
✅ Configures backend with SEO features  
✅ Builds and deploys frontend  
✅ Configures Nginx for simoo.skoolific.com  
✅ Sets up firewall  
✅ Prepares SSL certificate installation  

---

## DNS Configuration

**IMPORTANT**: Point your domain to the server!

In your domain registrar (where you manage simoo.skoolific.com):

### Add A Records:
| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.13.48.245 | 3600 |
| A | www | 76.13.48.245 | 3600 |

**Wait 5-30 minutes for DNS to propagate**

Check DNS: https://dnschecker.org/#A/simoo.skoolific.com

---

## After Deployment

### Your Site URLs:
- **Main Site**: https://simoo.skoolific.com
- **Admin Panel**: https://simoo.skoolific.com/admin
- **API**: https://simoo.skoolific.com/api

### Login Credentials:
- **Email**: ibrahimkamil362@gmail.com
- **Password**: Admin@123

⚠️ **Change password immediately after first login!**

---

## SEO Features Included

✅ **SEO-Friendly URLs**
- Categories: `/menu/beverages`
- Products: `/menu/beverages/ethiopian-coffee`

✅ **Location-Based SEO**
- Restaurant: Simoo Cafe
- Location: Dire Dawa, Ethiopia
- Keywords: "Cafe Dire Dawa, ethiopia, simoo cafe, coffee shop dire dawa..."

✅ **Meta Tags**
- Search engine optimized
- Social media ready
- Open Graph tags

✅ **SSL Certificate**
- HTTPS enabled
- Auto-renewal configured

---

## Verify Deployment

### Check Services:
```bash
pm2 status
systemctl status nginx
```

### View Logs:
```bash
pm2 logs restaurant-backend
tail -f /var/log/nginx/error.log
```

### Test Site:
```bash
curl http://simoo.skoolific.com
curl https://simoo.skoolific.com
```

---

## Update Your Site Later

```bash
ssh root@76.13.48.245
cd /root/digital_menu
git pull origin main
cd backend && npm install && pm2 restart restaurant-backend
cd ../frontend && npm install && npm run build
systemctl restart nginx
```

---

## Troubleshooting

### SSL Certificate Fails:
```bash
# Make sure DNS points to server first
# Check with: dig simoo.skoolific.com

# Then retry:
certbot --nginx -d simoo.skoolific.com -d www.simoo.skoolific.com
```

### Backend Not Starting:
```bash
pm2 logs restaurant-backend
# Check for errors
```

### Nginx Errors:
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### Database Issues:
```bash
cd /root/digital_menu/backend
npx prisma migrate reset
npx prisma migrate deploy
node seed.js
```

---

## Useful Commands

```bash
# Check status
pm2 status
systemctl status nginx

# Restart services
pm2 restart restaurant-backend
systemctl restart nginx

# View logs
pm2 logs restaurant-backend
tail -f /var/log/nginx/error.log

# SSL renewal (automatic, but can test)
certbot renew --dry-run

# Backup database
pg_dump -U restaurant_user restaurant_db > backup.sql
```

---

## Complete Deployment Checklist

- [ ] SSH into server (76.13.48.245)
- [ ] Run deployment script
- [ ] Point DNS to server IP
- [ ] Wait for DNS propagation (5-30 min)
- [ ] Install SSL certificate
- [ ] Test https://simoo.skoolific.com
- [ ] Login to admin panel
- [ ] Change admin password
- [ ] Upload restaurant logo
- [ ] Add menu items
- [ ] Generate QR codes
- [ ] Test ordering flow

---

## Support

**Repository**: https://github.com/ibrahim362-ai/digital_menu.git

**Server**: 76.13.48.245  
**Domain**: simoo.skoolific.com  
**Location**: Dire Dawa, Ethiopia  

---

**Ready to deploy? Just copy the 3 commands above!** 🚀

Simoo Cafe - Best Coffee & Food in Dire Dawa! ☕🍕
