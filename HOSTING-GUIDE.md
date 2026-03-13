# Hosting Guide - Digital Menu System

## ✅ Code Pushed to GitHub
Repository: https://github.com/ibrahim362-ai/digital_menu.git

## Hosting Options

### Option 1: VPS/Cloud Server (Recommended for Production)
Best for: Full control, custom domain, scalability

**Providers:**
- DigitalOcean ($6/month)
- Linode ($5/month)
- Vultr ($6/month)
- AWS Lightsail ($5/month)
- Hetzner ($4/month)

### Option 2: Platform as a Service (Easiest)
Best for: Quick deployment, no server management

**Providers:**
- Railway.app (Free tier available)
- Render.com (Free tier available)
- Fly.io (Free tier available)
- Heroku ($7/month)

---

## 🚀 Quick Deploy - VPS (Ubuntu Server)

### Step 1: Get a Server
1. Sign up for DigitalOcean/Linode/Vultr
2. Create Ubuntu 22.04 droplet/server
3. Note your server IP address
4. SSH into server: `ssh root@YOUR_SERVER_IP`

### Step 2: Clone and Deploy
```bash
# Clone repository
git clone https://github.com/ibrahim362-ai/digital_menu.git
cd digital_menu

# Make scripts executable
chmod +x deploy/*.sh

# Run complete deployment
./deploy/deploy-all.sh
```

### Step 3: Configure Environment
The script will prompt you for:
- Database password
- Domain name (or use IP address)
- Admin email for SSL

### Step 4: Apply SEO Migration
```bash
cd backend
npx prisma migrate deploy
node generate-slugs.js
pm2 restart restaurant-backend
```

### Step 5: Access Your Site
- Frontend: `http://YOUR_SERVER_IP` or `https://yourdomain.com`
- Backend API: `http://YOUR_SERVER_IP:5000`

---

## 🎯 Quick Deploy - Railway.app (Free)

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Deploy Backend
1. Select "Deploy from GitHub repo"
2. Choose `ibrahim362-ai/digital_menu`
3. Select `backend` as root directory
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```
5. Railway will auto-deploy

### Step 3: Deploy Frontend
1. Create new service in same project
2. Select same GitHub repo
3. Select `frontend` as root directory
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
5. Railway will auto-deploy

### Step 4: Add Database
1. Click "New" → "Database" → "PostgreSQL"
2. Copy connection string
3. Update backend's DATABASE_URL

### Step 5: Run Migrations
In Railway backend terminal:
```bash
npx prisma migrate deploy
node generate-slugs.js
```

---

## 🌐 Quick Deploy - Render.com (Free)

### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `digital-menu-db`
3. Copy Internal Database URL

### Step 3: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect GitHub repo: `ibrahim362-ai/digital_menu`
3. Settings:
   - Name: `digital-menu-backend`
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`
4. Add Environment Variables:
   ```
   DATABASE_URL=your-postgres-url
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```
5. Click "Create Web Service"

### Step 4: Deploy Frontend
1. Click "New +" → "Static Site"
2. Connect same GitHub repo
3. Settings:
   - Name: `digital-menu-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://digital-menu-backend.onrender.com
   ```
5. Click "Create Static Site"

### Step 5: Run Migrations
In Render backend shell:
```bash
npx prisma migrate deploy
node generate-slugs.js
```

---

## 🔧 Post-Deployment Steps

### 1. Create Admin Account
```bash
# SSH into your server or use platform terminal
cd backend
node seed.js
```

Default admin credentials:
- Email: `admin@restaurant.com`
- Password: `admin123`

**⚠️ Change this immediately after first login!**

### 2. Update Frontend API URL
Edit `frontend/.env`:
```
VITE_API_URL=https://your-backend-url.com
```

### 3. Configure Domain (Optional)
If using custom domain:
1. Point A record to your server IP
2. Run SSL setup: `./deploy/setup-ssl.sh`

### 4. Test Everything
- ✅ Frontend loads
- ✅ Admin login works
- ✅ Can create categories
- ✅ Can create products
- ✅ Slugs are generated
- ✅ QR codes work

---

## 📊 Monitoring & Maintenance

### Check Status
```bash
./deploy/check-status.sh
```

### View Logs
```bash
# Backend logs
pm2 logs restaurant-backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Update Application
```bash
# Backup first
./deploy/backup.sh

# Pull latest changes
git pull origin main

# Update
./deploy/update.sh
```

### Restart Services
```bash
# Restart backend
pm2 restart restaurant-backend

# Restart Nginx
sudo systemctl restart nginx
```

---

## 💰 Cost Comparison

| Provider | Free Tier | Paid Plan | Best For |
|----------|-----------|-----------|----------|
| Railway | 500 hrs/month | $5/month | Quick start |
| Render | 750 hrs/month | $7/month | Easy deploy |
| DigitalOcean | No | $6/month | Full control |
| Fly.io | 3 VMs free | $5/month | Global edge |
| Vercel + Railway | Frontend free | $5/month | Split hosting |

---

## 🆘 Troubleshooting

### Backend won't start
```bash
pm2 logs restaurant-backend
# Check for database connection errors
```

### Database connection failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check credentials in .env
cat backend/.env
```

### Frontend can't reach backend
- Check CORS settings in `backend/src/app.js`
- Verify `VITE_API_URL` in frontend `.env`
- Check firewall allows port 5000

### SSL certificate issues
```bash
sudo certbot renew --dry-run
```

---

## 📞 Need Help?

1. Check logs: `pm2 logs` or platform logs
2. Review deployment scripts in `deploy/` folder
3. Check GitHub issues
4. Verify environment variables are set correctly

---

## 🎉 You're Live!

Your restaurant management system is now hosted and accessible worldwide!

**Next Steps:**
1. Change default admin password
2. Upload your logo
3. Add your menu categories and products
4. Generate QR codes for tables
5. Share with your team

**Repository:** https://github.com/ibrahim362-ai/digital_menu.git
