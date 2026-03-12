# Deployment Scripts

This directory contains automated deployment scripts for the Restaurant Management System.

## Scripts Overview

| Script | Purpose |
|--------|---------|
| `install.sh` | Install Node.js, PM2, Nginx, PostgreSQL |
| `setup-database.sh` | Create database and user |
| `setup-backend.sh` | Configure and setup backend |
| `setup-frontend.sh` | Build and deploy frontend |
| `setup-nginx.sh` | Configure Nginx web server |
| `start-backend.sh` | Start backend with PM2 |
| `setup-ssl.sh` | Install SSL certificate |
| `setup-firewall.sh` | Configure UFW firewall |
| `update.sh` | Update application to latest version |
| `backup.sh` | Backup database and uploads |

## Quick Start

```bash
# Make scripts executable
chmod +x deploy/*.sh

# Run deployment
./deploy/install.sh
./deploy/setup-database.sh
./deploy/setup-backend.sh
./deploy/setup-frontend.sh
./deploy/setup-nginx.sh
./deploy/start-backend.sh
./deploy/setup-firewall.sh
./deploy/setup-ssl.sh
```

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
