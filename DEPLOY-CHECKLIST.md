# 🚀 Deployment Checklist

## ✅ Pre-Deployment

- [x] Code pushed to GitHub
- [ ] Choose hosting provider
- [ ] Server/account created
- [ ] Domain purchased (optional)

## 📋 Deployment Steps

### For VPS (DigitalOcean/Linode/Vultr)

```bash
# 1. SSH into server
ssh root@YOUR_SERVER_IP

# 2. Clone repository
git clone https://github.com/ibrahim362-ai/digital_menu.git
cd digital_menu

# 3. Make scripts executable
chmod +x deploy/*.sh

# 4. Run deployment
./deploy/deploy-all.sh

# 5. Apply SEO migration
cd backend
npx prisma migrate deploy
node generate-slugs.js
pm2 restart restaurant-backend
```

### For Railway/Render (Platform as a Service)

**Backend:**
1. Create new web service from GitHub
2. Set root directory: `backend`
3. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT=5000`
4. Deploy

**Frontend:**
1. Create new static site from GitHub
2. Set root directory: `frontend`
3. Add environment variable:
   - `VITE_API_URL=https://your-backend-url`
4. Deploy

**Database:**
1. Create PostgreSQL database
2. Copy connection URL
3. Update backend DATABASE_URL
4. Run migrations in backend terminal:
   ```bash
   npx prisma migrate deploy
   node generate-slugs.js
   ```

## ✅ Post-Deployment

- [ ] Frontend accessible
- [ ] Backend API responding
- [ ] Database connected
- [ ] Admin login works
- [ ] Create test category
- [ ] Create test product
- [ ] Verify slug generation
- [ ] Test QR code generation
- [ ] Change default admin password
- [ ] Upload restaurant logo
- [ ] Configure restaurant settings

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Set up backups
- [ ] Review CORS settings

## 📱 Testing Checklist

- [ ] Admin panel loads
- [ ] Can create/edit categories
- [ ] Can create/edit products
- [ ] Products show correct slugs
- [ ] Image upload works
- [ ] QR codes generate
- [ ] Orders can be created
- [ ] Kitchen view works
- [ ] Mobile responsive
- [ ] Multi-language works

## 🎯 Quick Commands

### Check Status
```bash
./deploy/check-status.sh
```

### View Logs
```bash
pm2 logs restaurant-backend
```

### Restart Backend
```bash
pm2 restart restaurant-backend
```

### Backup Database
```bash
./deploy/backup.sh
```

### Update Application
```bash
git pull origin main
./deploy/update.sh
```

## 📊 Access URLs

- **Frontend:** `http://YOUR_IP` or `https://yourdomain.com`
- **Backend API:** `http://YOUR_IP:5000`
- **Admin Panel:** `http://YOUR_IP/admin`

## 🆘 Common Issues

### Backend won't start
```bash
pm2 logs restaurant-backend
# Check database connection
```

### Frontend shows API error
- Verify `VITE_API_URL` in frontend/.env
- Check backend is running
- Check CORS settings

### Database migration fails
```bash
cd backend
npx prisma migrate reset
npx prisma migrate deploy
node seed.js
```

## 📞 Support

- Repository: https://github.com/ibrahim362-ai/digital_menu.git
- Check HOSTING-GUIDE.md for detailed instructions
- Review deploy/README.md for script documentation

---

**Status:** Ready to deploy! 🎉
