# Deployment Scripts

Automated deployment scripts for the Restaurant Management System.

## Core Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `deploy-all.sh` | Complete deployment | First-time setup |
| `deploy-to-production.sh` | Production deployment | Production server |
| `update.sh` | Update application | After code changes |
| `backup.sh` | Backup database & uploads | Before updates |
| `check-status.sh` | Check system status | Troubleshooting |

## Setup Scripts (Individual)

| Script | Purpose |
|--------|---------|
| `install.sh` | Install Node.js, PM2, Nginx, PostgreSQL |
| `setup-database.sh` | Create database and user |
| `setup-backend.sh` | Configure and setup backend |
| `setup-frontend.sh` | Build and deploy frontend |
| `setup-nginx.sh` | Configure Nginx web server |
| `setup-ssl.sh` | Install SSL certificate |
| `setup-firewall.sh` | Configure UFW firewall |
| `start-backend.sh` | Start backend with PM2 |

## Quick Start

### Option 1: One Command (Recommended)
```bash
chmod +x deploy/*.sh
./deploy/deploy-all.sh
```

### Option 2: Step by Step
```bash
chmod +x deploy/*.sh
./deploy/install.sh
./deploy/setup-database.sh
./deploy/setup-backend.sh
./deploy/setup-frontend.sh
./deploy/setup-nginx.sh
./deploy/start-backend.sh
./deploy/setup-firewall.sh
./deploy/setup-ssl.sh
```

## Common Tasks

### Update Application
```bash
./deploy/backup.sh
./deploy/update.sh
```

### Check Status
```bash
./deploy/check-status.sh
```

### Restart Backend
```bash
pm2 restart restaurant-backend
```

See `../DEPLOYMENT.md` for detailed instructions.
