# 🚨 SSH Connection Refused - Alternative Deployment Options

## Issue: Cannot Connect to 76.13.48.245

**Error**: `ssh: connect to host 76.13.48.245 port 22: Connection refused`

### Possible Causes:
1. Server is not running or powered off
2. SSH service is not running on the server
3. Firewall is blocking port 22
4. Wrong IP address
5. Server provider has restrictions

---

## ✅ Solution 1: Check Server Status

### If using a VPS provider (DigitalOcean, Linode, Vultr, etc.):

1. **Login to your provider's dashboard**
2. **Check if the server (droplet) is running**
3. **Verify the IP address is correct: 76.13.48.245**
4. **Check if SSH is enabled**
5. **Try accessing via provider's web console**

### Common Provider Consoles:
- **DigitalOcean**: Droplets → Your Droplet → Access → Launch Console
- **Linode**: Linodes → Your Linode → Launch LISH Console
- **Vultr**: Servers → Your Server → View Console
- **AWS Lightsail**: Instances → Connect using SSH

---

## ✅ Solution 2: Use Alternative Hosting (Easier)

Since SSH is not working, consider these easier alternatives:

### Option A: Railway.app (Recommended - Free & Easy)

**No SSH needed! Deploy in 5 minutes:**

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select: `ibrahim362-ai/digital_menu`

**Deploy Backend:**
- Root Directory: `backend`
- Add PostgreSQL database (click "New" → "Database" → "PostgreSQL")
- Add environment variables:
  ```
  DATABASE_URL=<copy from Railway PostgreSQL>
  JWT_SECRET=your-secret-key-here
  JWT_REFRESH_SECRET=your-refresh-secret-here
  PORT=5000
  NODE_ENV=production
  ```
- Deploy!

**Deploy Frontend:**
- Create new service
- Root Directory: `frontend`
- Add environment variable:
  ```
  VITE_API_URL=https://your-backend-url.railway.app
  ```
- Deploy!

**Run Migrations:**
In Railway backend terminal:
```bash
npx prisma migrate deploy
node seed-seo.js
node generate-slugs.js
```

**Cost**: Free (500 hours/month)

---

### Option B: Render.com (Also Free)

1. Go to https://render.com
2. Sign up with GitHub

**Create Database:**
- New → PostgreSQL
- Copy Internal Database URL

**Deploy Backend:**
- New → Web Service
- Connect repo: `ibrahim362-ai/digital_menu`
- Root Directory: `backend`
- Build Command: `npm install && npx prisma generate`
- Start Command: `npm start`
- Environment Variables:
  ```
  DATABASE_URL=<your-postgres-url>
  JWT_SECRET=your-secret-key
  JWT_REFRESH_SECRET=your-refresh-secret
  NODE_ENV=production
  ```

**Deploy Frontend:**
- New → Static Site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variable:
  ```
  VITE_API_URL=https://your-backend.onrender.com
  ```

**Run Migrations:**
In Render backend shell:
```bash
npx prisma migrate deploy
node seed-seo.js
node generate-slugs.js
```

**Cost**: Free tier available

---

### Option C: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
1. Go to https://vercel.com
2. Import from GitHub: `ibrahim362-ai/digital_menu`
3. Root Directory: `frontend`
4. Framework: Vite
5. Add env: `VITE_API_URL=https://your-backend.railway.app`

**Backend on Railway:**
(Follow Railway steps from Option A)

**Cost**: Both have free tiers

---

## ✅ Solution 3: Fix SSH Connection

If you want to fix the VPS server:

### Check Server Status:
1. Login to your VPS provider dashboard
2. Check if server is running
3. Check server IP address
4. Try restarting the server

### Try Different SSH Port:
```bash
ssh -p 2222 root@76.13.48.245
```

### Check if Server is Reachable:
```bash
ping 76.13.48.245
```

### Use Provider's Web Console:
Most VPS providers offer a web-based console that doesn't require SSH.

### Once Connected via Console:
```bash
# Check if SSH is running
systemctl status sshd

# Start SSH if not running
systemctl start sshd
systemctl enable sshd

# Check firewall
ufw status
ufw allow 22/tcp
```

---

## 🎯 Recommended Next Steps

### For Beginners: Use Railway.app
- No server management needed
- Automatic deployments from GitHub
- Free tier available
- Takes 5 minutes

### For Production: Fix VPS or Use Render
- More control
- Better performance
- Custom domain support
- $5-7/month

---

## 📞 Quick Decision Guide

**Choose Railway if:**
- ✅ You want the easiest setup
- ✅ You're okay with free tier limits
- ✅ You want automatic deployments

**Choose Render if:**
- ✅ You want more free hours
- ✅ You need better free tier
- ✅ You want static site hosting

**Fix VPS if:**
- ✅ You already paid for it
- ✅ You want full control
- ✅ You need custom configuration

---

## 🚀 Quick Start: Railway (5 Minutes)

1. **Sign up**: https://railway.app (use GitHub)
2. **New Project** → Deploy from GitHub
3. **Select repo**: ibrahim362-ai/digital_menu
4. **Add PostgreSQL**: New → Database → PostgreSQL
5. **Deploy Backend**: 
   - Root: `backend`
   - Add DATABASE_URL from PostgreSQL
6. **Deploy Frontend**:
   - Root: `frontend`
   - Add VITE_API_URL from backend
7. **Run migrations** in backend terminal:
   ```bash
   npx prisma migrate deploy
   node seed-seo.js
   ```

**Done!** Your site is live! 🎉

---

## Need Help?

1. **Check server provider dashboard** - Is server running?
2. **Try Railway.app** - Easiest alternative
3. **Use provider's web console** - Access without SSH
4. **Contact VPS support** - They can help with SSH issues

---

**Repository**: https://github.com/ibrahim362-ai/digital_menu.git

All your code is safely on GitHub and ready to deploy anywhere! 🚀
