# Restaurant Management System

A modern, full-stack restaurant management system with QR code ordering, multi-language support, and comprehensive admin controls.

## Features

- **Multi-language Support**: English, Afaan Oromo, Amharic, Somali, Arabic
- **SEO-Friendly URLs**: Automatic slug generation for categories and products
- **QR Code Ordering**: Customers scan QR codes to view menu and place orders
- **Real-time Order Management**: Kitchen and cashier dashboards for order tracking
- **Product & Category Management**: Full CRUD operations with image uploads
- **Branding Customization**: Custom logo, colors, and restaurant name
- **Security**: JWT authentication, rate limiting, input sanitization, audit logging
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT authentication
- Helmet + CORS security
- Multer for file uploads

### Frontend
- React 19 + Vite
- TailwindCSS 4
- React Router
- Axios
- Framer Motion
- Recharts

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Development Setup

1. Clone the repository
```bash
git clone <repository-url>
cd restaurant-management
```

2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate deploy
npx prisma generate
node seed.js
npm run dev
```

3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
```

4. Access the application
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Default admin: admin@restaurant.com / admin123

## Production Deployment

### Quick Deploy to VPS Server

```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Download and run deployment script
curl -o deploy.sh https://raw.githubusercontent.com/ibrahim362-ai/digital_menu/main/SERVER-DEPLOY.sh
chmod +x deploy.sh
./deploy.sh
```

The script automatically installs Node.js, PostgreSQL, Nginx, PM2, and deploys your application.

### Manual Deployment

```bash
git clone https://github.com/ibrahim362-ai/digital_menu.git
cd digital_menu
chmod +x deploy/*.sh
./deploy/deploy-all.sh

# Apply SEO migration
cd backend
npx prisma migrate deploy
node generate-slugs.js
pm2 restart restaurant-backend
```

### Platform as a Service (Railway/Render)

1. Sign up at Railway.app or Render.com
2. Connect your GitHub repository
3. Add PostgreSQL database
4. Deploy backend (root: `backend`)
5. Deploy frontend (root: `frontend`)
6. Run migrations in backend terminal:
```bash
npx prisma migrate deploy
node generate-slugs.js
```

See [deploy/README.md](deploy/README.md) for detailed instructions.

## Project Structure

```
├── backend/
│   ├── prisma/          # Database schema and migrations
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth, security, upload middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Helper functions
│   ├── uploads/         # Uploaded images
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   └── utils/       # Helper functions
│   └── dist/            # Production build
└── deploy/              # Deployment scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders
- `GET /api/orders` - List orders (admin)
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (admin)
- `DELETE /api/orders/:id` - Delete order (admin)

### QR Codes
- `GET /api/qrcodes` - List QR codes
- `POST /api/qrcodes` - Generate QR code (admin)
- `DELETE /api/qrcodes/:id` - Delete QR code (admin)

### Settings
- `GET /api/settings` - Get restaurant settings
- `PUT /api/settings` - Update settings (admin)

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/restaurant
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## Security Features

- JWT access & refresh tokens
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Input sanitization
- CORS whitelist
- Helmet security headers
- Account lockout after failed logins
- Audit logging
- Content-Type validation

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
