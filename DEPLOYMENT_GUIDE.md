# 🚀 Deployment Guide for VPS

## Quick Deployment Steps

### 1. Connect to your VPS
```bash
ssh root@76.13.48.245
```

### 2. Run the automated deployment script

Copy and paste this entire command block:

```bash
# Navigate to web directory
cd /var/www

# Clone the repository
git clone https://github.com/ibrahim362-ai/digital_menu.git
cd digital_menu

# Make deployment script executable
chmod +x deploy-to-vps.sh

# Run deployment
./deploy-to-vps.sh
```

---

## Manual Deployment (Alternative)

If you prefer to deploy manually, follow these steps:

### Step 1: Install Prerequisites
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 and Nginx
npm install -g pm2
apt install -y nginx
```

### Step 2: Clone Repository
```bash
cd /var/www
git clone https://github.com/ibrahim362-ai/digital_menu.git
cd digital_menu
```

### Step 3: Setup Backend
```bash
cd backend
npm install

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="postgresql://simoo:O@76.13.48.245:3600/A?schema=public"
JWT_SECRET="6324e4bcbccc693459619dacecd49be7653341ad48e9da4d76e7f7ba9719b63e"
JWT_REFRESH_SECRET="579c1333f3636f257a084a359349b2cc6975cb77af20809c6b84503e98203b19"
NODE_ENV="production"
CORS_ORIGIN="https://simoo.skoolific.com"
PORT=5050
EOF

# Run database migrations
npx prisma generate
npx prisma migrate deploy

# Start with PM2
pm2 start src/app.js --name "digital-menu-backend"
pm2 save
pm2 startup
```

### Step 4: Setup Frontend
```bash
cd ../frontend
npm install

# Create production .env
echo 'VITE_API_URL=https://simoo.skoolific.com/api' > .env

# Build
npm run build

# Copy to Nginx
mkdir -p /var/www/html/digital-menu
cp -r dist/* /var/www/html/digital-menu/
```

### Step 5: Configure Nginx
```bash
cat > /etc/nginx/sites-available/digital-menu << 'EOF'
server {
    listen 80;
    server_name simoo.skoolific.com;

    location / {
        root /var/www/html/digital-menu;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        proxy_pass http://localhost:5050;
        proxy_set_header Host $host;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 6: Setup SSL (Recommended)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d simoo.skoolific.com
```

---

## Useful Commands

### Backend Management
```bash
# View logs
pm2 logs digital-menu-backend

# Restart backend
pm2 restart digital-menu-backend

# Stop backend
pm2 stop digital-menu-backend

# View status
pm2 status
```

### Update Deployment
```bash
cd /var/www/digital_menu
git pull origin main

# Update backend
cd backend
npm install
npx prisma migrate deploy
pm2 restart digital-menu-backend

# Update frontend
cd ../frontend
npm install
npm run build
cp -r dist/* /var/www/html/digital-menu/
```

### Nginx Management
```bash
# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# View error logs
tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### Backend not starting
```bash
pm2 logs digital-menu-backend
# Check for errors in the logs
```

### Database connection issues
```bash
# Test database connection
cd /var/www/digital_menu/backend
npx prisma db pull
```

### Port already in use
```bash
# Check what's using port 5050
lsof -i :5050
# Kill the process if needed
kill -9 <PID>
```

### Nginx 502 Bad Gateway
```bash
# Check if backend is running
pm2 status
# Check Nginx error logs
tail -f /var/log/nginx/error.log
```

---

## Access Your Application

- **Frontend**: https://simoo.skoolific.com
- **Admin Login**: https://simoo.skoolific.com/admin/login
- **API Health Check**: https://simoo.skoolific.com/api/health

---

## Default Admin Credentials

Check your database or seed file for admin credentials.
