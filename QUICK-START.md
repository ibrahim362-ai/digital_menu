# 🚀 Quick Start - Deploy in 5 Minutes

## ✅ Your Code is on GitHub
**Repository:** https://github.com/ibrahim362-ai/digital_menu.git

---

## Choose Your Hosting Path

### 🎯 Path 1: Free & Easy (Railway.app)
**Time:** 5 minutes | **Cost:** Free

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repo: `ibrahim362-ai/digital_menu`
5. Add PostgreSQL database
6. Deploy backend (root: `backend`)
7. Deploy frontend (root: `frontend`)
8. Done! ✨

**Pros:** Free, automatic deployments, easy setup
**Cons:** Limited free hours (500/month)

---

### 💪 Path 2: Full Control (VPS)
**Time:** 15 minutes | **Cost:** $5-6/month

1. Get Ubuntu server (DigitalOcean/Linode/Vultr)
2. SSH into server: `ssh root@YOUR_IP`
3. Run these commands:
```bash
git clone https://github.com/ibrahim362-ai/digital_menu.git
cd digital_menu
chmod +x deploy/*.sh
./deploy/deploy-all.sh
```
4. Apply SEO migration:
```bash
cd backend
npx prisma migrate deploy
node generate-slugs.js
pm2 restart restaurant-backend
```
5. Done! ✨

**Pros:** Full control, better performance, custom domain
**Cons:** Requires basic Linux knowledge

---

## 📋 What You Get

✅ Restaurant management system
✅ Admin panel for menu management
✅ QR code generation for tables
✅ Kitchen order display
✅ Multi-language support (English, Oromo, Amharic, Somali, Arabic)
✅ SEO-friendly URLs
✅ Mobile responsive
✅ Real-time order updates

---

## 🎯 After Deployment

### 1. Login to Admin Panel
- URL: `https://your-domain.com/admin`
- Email: `admin@restaurant.com`
- Password: `admin123`

**⚠️ CHANGE PASSWORD IMMEDIATELY!**

### 2. Configure Your Restaurant
- Upload logo
- Set restaurant name
- Choose brand colors
- Add categories
- Add products with images

### 3. Generate QR Codes
- Go to QR Codes section
- Create codes for each table
- Print and place on tables

### 4. Start Taking Orders!
Customers scan QR → Browse menu → Place order → Kitchen receives it

---

## 📚 Documentation

- **Full Hosting Guide:** See `HOSTING-GUIDE.md`
- **Deployment Checklist:** See `DEPLOY-CHECKLIST.md`
- **SEO Setup:** See `SETUP-SEO.md`
- **Deployment Scripts:** See `deploy/README.md`

---

## 🆘 Need Help?

### Quick Fixes

**Backend won't start?**
```bash
pm2 logs restaurant-backend
```

**Frontend can't connect?**
Check `frontend/.env` has correct `VITE_API_URL`

**Database issues?**
```bash
cd backend
npx prisma migrate reset
npx prisma migrate deploy
node seed.js
```

---

## 💡 Recommended: Railway.app (Easiest)

For beginners, I recommend Railway.app:

1. **Sign up:** https://railway.app (use GitHub)
2. **New Project** → Deploy from GitHub
3. **Add Database:** PostgreSQL
4. **Deploy Backend:**
   - Root: `backend`
   - Add env vars: `DATABASE_URL`, `JWT_SECRET`
5. **Deploy Frontend:**
   - Root: `frontend`
   - Add env var: `VITE_API_URL`
6. **Run migrations** in backend terminal:
   ```bash
   npx prisma migrate deploy
   node generate-slugs.js
   ```

**You're live in 5 minutes!** 🎉

---

## 🌟 Pro Tips

1. Use a custom domain for better branding
2. Enable SSL/HTTPS for security
3. Set up automatic backups
4. Monitor with `pm2 monit` (VPS) or platform dashboard
5. Keep your admin password secure

---

**Ready to go live?** Pick your path above and follow the steps! 🚀
