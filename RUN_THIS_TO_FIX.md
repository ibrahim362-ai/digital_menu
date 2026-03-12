# 🚀 Fix Your Site - Run This Command

Your site shows "Not secure" because SSL (HTTPS) is not enabled.

## ⚡ Quick Fix - Copy and Run This:

Open your terminal and run:

```bash
ssh root@76.13.48.245 "cd /var/www/digital_menu && chmod +x deploy/*.sh && ./deploy/enable-ssl-now.sh"
```

**That's it!** This single command will:
1. Connect to your VPS
2. Navigate to your project
3. Make scripts executable
4. Install SSL certificate
5. Configure HTTPS
6. Enable automatic renewal

## ✅ After Running

1. Wait 1-2 minutes for SSL to activate
2. Visit: **https://simoo.skoolific.com** (note the "https")
3. The "Not secure" warning will be gone
4. Your site will have a padlock icon 🔒

## 🔍 If You Get an Error

Run the diagnostic script:

```bash
ssh root@76.13.48.245 "cd /var/www/digital_menu && ./deploy/diagnose-ssl.sh"
```

## 📋 Manual Steps (If Automated Fails)

```bash
# 1. Connect to VPS
ssh root@76.13.48.245

# 2. Navigate to project
cd /var/www/digital_menu

# 3. Run SSL setup
./deploy/enable-ssl-now.sh
```

## ❓ Common Questions

**Q: Will this break my site?**
A: No, it only adds HTTPS. Your site will work on both HTTP and HTTPS.

**Q: How long does it take?**
A: 2-3 minutes for the script to complete.

**Q: Do I need to do this again?**
A: No, the certificate auto-renews every 90 days.

**Q: What if my domain isn't pointing to the server?**
A: Make sure simoo.skoolific.com DNS points to 76.13.48.245 first.

## 🆘 Need Help?

If you see any errors, copy the error message and share it.
