# 🔒 Fix "Not Secure" Warning - Enable HTTPS

Your site is currently running on HTTP only, which causes the "Not secure" warning in browsers.

## Quick Fix (Recommended)

**Option 1: One Command (Easiest)**

SSH into your VPS and run:

```bash
ssh root@76.13.48.245
cd /var/www/digital_menu
./deploy/enable-ssl-now.sh
```

**Option 2: Direct from GitHub**

```bash
ssh root@76.13.48.245
curl -sSL https://raw.githubusercontent.com/ibrahim362-ai/digital_menu/main/deploy/enable-ssl-now.sh | sudo bash
```

## What This Does

1. Installs Certbot (Let's Encrypt SSL tool)
2. Obtains a free SSL certificate for simoo.skoolific.com
3. Automatically configures Nginx for HTTPS
4. Enables automatic certificate renewal
5. Redirects HTTP to HTTPS

## After Running

- Your site will be accessible at: **https://simoo.skoolific.com**
- The "Not secure" warning will disappear
- All HTTP traffic will automatically redirect to HTTPS

## Troubleshooting

If you encounter issues, run the diagnostic script:

```bash
cd /var/www/digital_menu
./deploy/diagnose-ssl.sh
```

### Common Issues

**"Domain not accessible"**
- Make sure simoo.skoolific.com DNS points to 76.13.48.245
- Wait a few minutes for DNS propagation

**"Certificate already exists"**
- Your SSL might already be set up
- Check: `certbot certificates`
- Visit: https://simoo.skoolific.com

**"Nginx test failed"**
- Check nginx config: `nginx -t`
- View errors: `tail -f /var/log/nginx/error.log`

## Manual Steps (If Automated Script Fails)

```bash
# 1. Install Certbot
apt update
apt install -y certbot python3-certbot-nginx

# 2. Get SSL certificate
certbot --nginx -d simoo.skoolific.com --email admin@simoo.skoolific.com

# 3. Restart Nginx
systemctl restart nginx

# 4. Test
curl -I https://simoo.skoolific.com
```

## Verify SSL is Working

```bash
# Check certificate
openssl s_client -connect simoo.skoolific.com:443 -servername simoo.skoolific.com

# Check auto-renewal
certbot renew --dry-run
```

## Need Help?

Run diagnostics and share the output:
```bash
./deploy/diagnose-ssl.sh > ssl-diagnostic.txt
cat ssl-diagnostic.txt
```
