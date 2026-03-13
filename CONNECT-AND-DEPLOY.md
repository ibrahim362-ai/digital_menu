# 🚀 Connect and Deploy to Your Server

## Server Details
- **IP**: 76.13.48.245
- **User**: root
- **Password**: -u)HmA@W@ion9g)TuJ4Zh
- **Domain**: https://simoo.skoolific.com/

---

## Step 1: Connect to Server

### Windows PowerShell:
```powershell
ssh root@76.13.48.245
```

When prompted for password, paste:
```
-u)HmA@W@ion9g)TuJ4Zh
```

**Note**: The password won't show as you type - this is normal!

---

## Step 2: Once Connected, Run These Commands

### Option A: Automated Deployment (Recommended)

```bash
# Download deployment script
curl -o deploy.sh https://raw.githubusercontent.com/ibrahim362-ai/digital_menu/main/SERVER-DEPLOY.sh

# Make executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Option B: If Project Already Exists (Update)

```bash
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

## Step 3: Configure Domain

Your domain: **simoo.skoolific.com**

### Update Nginx Configuration:

```bash
nano /etc/nginx/sites-available/digital-menu
```

Change `server_name` line to:
```nginx
server_name simoo.skoolific.com www.simoo.skoolific.com 76.13.48.245;
```

Save and exit (Ctrl+X, then Y, then Enter)

### Test and Restart Nginx:
```bash
nginx -t
systemctl restart nginx
```

---

## Step 4: Point Domain to Server

In your domain registrar (where you bought simoo.skoolific.com):

1. Go to DNS settings
2. Add/Update A record:
   - **Type**: A
   - **Name**: @ (or simoo)
   - **Value**: 76.13.48.245
   - **TTL**: 3600

3. Add www subdomain (optional):
   - **Type**: A
   - **Name**: www
   - **Value**: 76.13.48.245
   - **TTL**: 3600

**Wait 5-30 minutes for DNS to propagate**

---

## Step 5: Install SSL Certificate (HTTPS)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d simoo.skoolific.com -d www.simoo.skoolific.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)
```

---

## Step 6: Update Frontend API URL

```bash
cd /root/digital_menu/frontend

# Edit .env file
nano .env
```

Change to:
```
VITE_API_URL=https://simoo.skoolific.com/api
```

Or if API is on different port:
```
VITE_API_URL=https://simoo.skoolific.com:5000
```

Save and rebuild:
```bash
npm run build
```

---

## Step 7: Update Backend CORS

```bash
cd /root/digital_menu/backend/src

nano app.js
```

Find CORS configuration and update to:
```javascript
const corsOptions = {
  origin: [
    'https://simoo.skoolific.com',
    'https://www.simoo.skoolific.com',
    'http://simoo.skoolific.com',
    'http://76.13.48.245'
  ],
  credentials: true
};
```

Restart backend:
```bash
pm2 restart restaurant-backend
```

---

## Verify Deployment

### Check Services:
```bash
pm2 status
systemctl status nginx
```

### Test URLs:
- http://76.13.48.245 (should work immediately)
- https://simoo.skoolific.com (after DNS propagates)

### Check Logs:
```bash
pm2 logs restaurant-backend
tail -f /var/log/nginx/error.log
```

---

## Quick Commands Summary

```bash
# Connect
ssh root@76.13.48.245
# Password: -u)HmA@W@ion9g)TuJ4Zh

# Deploy/Update
cd /root/digital_menu && git pull origin main
cd backend && npm install && npx prisma migrate deploy && node seed-seo.js
pm2 restart restaurant-backend
cd ../frontend && npm install && npm run build
systemctl restart nginx

# Check status
pm2 status
pm2 logs restaurant-backend
systemctl status nginx

# SSL
certbot --nginx -d simoo.skoolific.com -d www.simoo.skoolific.com
```

---

## Troubleshooting

### Can't connect via SSH:
```bash
# Try with explicit password flag
ssh root@76.13.48.245
# Then paste password when prompted
```

### Domain not working:
- Check DNS propagation: https://dnschecker.org
- Wait 5-30 minutes after DNS changes
- Clear browser cache

### SSL certificate fails:
- Make sure domain points to server first
- Check firewall allows port 80 and 443:
  ```bash
  ufw allow 80/tcp
  ufw allow 443/tcp
  ```

### Backend not starting:
```bash
pm2 logs restaurant-backend
# Check for errors
```

---

## After Successful Deployment

Your site will be live at:
- **Main Site**: https://simoo.skoolific.com
- **Admin Panel**: https://simoo.skoolific.com/admin

**Login Credentials**:
- Email: ibrahimkamil362@gmail.com
- Password: Admin@123

⚠️ **Change password immediately!**

---

## SEO Features Now Live:
✅ SEO-friendly URLs
✅ Location: Dire Dawa, Ethiopia  
✅ Keywords: "Cafe Dire Dawa, ethiopia, simoo cafe..."
✅ Meta tags optimized
✅ Custom domain with SSL

---

**Ready to deploy? Just copy the SSH command and paste the password!** 🚀
