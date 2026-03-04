# Restaurant Management System 🍽️

A comprehensive full-stack restaurant management platform with **enterprise-grade security**, multi-language support (5 languages), featuring admin dashboard, cashier POS system, kitchen display system, and customer menu with QR code ordering capabilities. Built for modern restaurants to streamline operations from order taking to kitchen preparation.

## 🔒 Security First

This system implements **production-ready security** with:
- ✅ JWT authentication with refresh tokens
- ✅ HttpOnly cookies (XSS protection)
- ✅ Account lockout after failed attempts
- ✅ Rate limiting (brute force protection)
- ✅ Comprehensive audit logging
- ✅ Role-based access control (RBAC)
- ✅ Password policy enforcement
- ✅ SQL injection protection
- ✅ CORS whitelist configuration
- ✅ Security headers (Helmet)

See [Security Features](#-security-features) for complete details.

## 🌟 Key Features

### 👨‍💼 Admin Dashboard
- **Product Management**: Create, update, delete products with multi-language support
- **Category Management**: Organize menu items into categories (5 languages)
- **Image Upload**: Upload and manage product images
- **QR Code Generator**: Create unique QR codes for each table
- **Settings & User Management**: 
  - Update admin credentials (email, password, name)
  - Create, edit, and delete cashier accounts
  - Create, edit, and delete kitchen staff accounts
  - Centralized user management interface
- **Order Analytics**: View order statistics, revenue tracking, and status distribution
- **Menu Control**: Toggle product visibility in customer menu
- **Multi-language Support**: English, Afaan Oromo, Amharic, Somali, Arabic
- **Modern UI**: Animated interface with Framer Motion and Lucide icons

### 💰 Cashier POS System
- **Order Creation**: Quick order entry with product selection
- **Table Management**: Assign orders to specific table numbers
- **Order Tracking**: Monitor order status in real-time
- **Priority Setting**: Mark orders as low, normal, or high priority
- **Order Notes**: Add special instructions or customer requests
- **Order History**: View all orders with filtering by status
- **Total Calculation**: Automatic price calculation with itemized breakdown

### 👨‍🍳 Kitchen Display System
- **Real-time Orders**: Instant notification of new orders
- **Order Queue**: View all pending and preparing orders
- **Status Management**: Update order status (pending → preparing → ready → completed)
- **Order Acceptance**: Accept orders to start preparation
- **Priority Indicators**: Visual priority markers (low/normal/high)
- **Time Tracking**: Track acceptance and completion timestamps
- **Order Details**: View full order items, quantities, and special notes

### 📱 Customer Menu (QR Code Access)
- **Multi-language Display**: Switch between 5 supported languages
- **Category Browsing**: Filter products by category
- **Product Gallery**: View product images and descriptions
- **Price Display**: Clear pricing information
- **Responsive Design**: Mobile-optimized for customer devices
- **QR Code Access**: Scan table QR code to access menu

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **QR Code**: qrcode library
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 8.0
- **Styling**: Tailwind CSS 4.2
- **Routing**: React Router DOM 7.13
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with:
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_db"
JWT_SECRET="your-strong-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-different-refresh-secret-min-32-chars"
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173,http://localhost:5174"
PORT=3001

# Run Prisma migrations
npx prisma migrate dev

# Seed the database with secure passwords
node seed.js

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file with:
VITE_API_URL=http://localhost:3001/api

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or 5174) and backend on `http://localhost:3001`

### 4. Access the Application

**Admin Dashboard:**
- URL: http://localhost:5173/admin/login
- Email: `ibrahimkamil362@gmail.com`
- Password: `Admin@123`

**Cashier POS:**
- URL: http://localhost:5173/cashier/login
- Username: `cashier`
- Password: `Cashier@123`

**Kitchen Display:**
- URL: http://localhost:5173/kitchen/login
- Username: `kitchen`
- Password: `Kitchen@123`

**⚠️ Important:** Change these credentials before deploying to production!

## 📁 Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── migrations/        # Database migrations
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth & upload middleware
│   │   └── routes/            # API endpoints
│   ├── uploads/               # Product images
│   └── seed.js                # Database seeding
│
├── frontend/
│   └── src/
│       ├── pages/             # React pages/components
│       │   ├── Admin.jsx
│       │   ├── AdminLogin.jsx
│       │   ├── Cashier.jsx
│       │   ├── CashierLogin.jsx
│       │   ├── Kitchen.jsx
│       │   ├── KitchenLogin.jsx
│       │   └── Home.jsx
│       └── App.jsx            # Main app component
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admin/login` | Admin authentication | No |
| POST | `/cashier/login` | Cashier authentication | No |
| POST | `/kitchen/login` | Kitchen authentication | No |
| POST | `/refresh` | Refresh access token | Refresh Token |
| POST | `/logout` | Logout and revoke tokens | Yes |
| GET | `/profile` | Get current user profile | Yes |
| GET | `/sessions` | List active sessions | Yes |
| DELETE | `/sessions/:id` | Revoke specific session | Yes |
| POST | `/sessions/revoke-all` | Revoke all sessions | Yes |

**Login Request Body (Admin):**
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

**Login Request Body (Cashier/Kitchen):**
```json
{
  "username": "cashier",
  "password": "Cashier@123"
}
```

**Login Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```
*Note: Tokens are set in HttpOnly cookies automatically*

### Admin Routes (`/api/admin`)
*Legacy endpoint - use `/api/auth/admin/login` instead*

### Cashier Routes (`/api/cashier`)
*Note: Use `/api/auth/cashier/login` for authentication*
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get cashier profile | Cashier |
| GET | `/orders` | List cashier's orders | Cashier |
| GET | `/stats/today` | Today's statistics | Cashier |

### Kitchen Routes (`/api/kitchen`)
*Note: Use `/api/auth/kitchen/login` for authentication*
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get kitchen profile | Kitchen |
| GET | `/orders` | List kitchen orders | Kitchen |
| PATCH | `/orders/:id/status` | Update order status | Kitchen |
| GET | `/stats/today` | Today's statistics | Kitchen |

### Settings Routes (`/api/settings`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PUT | `/admin` | Update admin credentials | Admin |
| GET | `/cashiers` | List all cashiers | Admin |
| POST | `/cashiers` | Create cashier account | Admin |
| PUT | `/cashiers/:id` | Update cashier account | Admin |
| DELETE | `/cashiers/:id` | Delete cashier account | Admin |
| GET | `/kitchens` | List all kitchen users | Admin |
| POST | `/kitchens` | Create kitchen account | Admin |
| PUT | `/kitchens/:id` | Update kitchen account | Admin |
| DELETE | `/kitchens/:id` | Delete kitchen account | Admin |

**Request Body (Update Admin):**
```json
{
  "email": "admin@example.com",
  "password": "newpassword123",
  "name": "Admin Name"
}
```

**Request Body (Create/Update Cashier):**
```json
{
  "username": "cashier1",
  "password": "password123",
  "name": "John Doe"
}
```

**Request Body (Create/Update Kitchen):**
```json
{
  "username": "kitchen1",
  "password": "password123",
  "name": "Chef Name"
}
```

### Category Routes (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all categories | No |
| POST | `/` | Create category | Admin |
| PUT | `/:id` | Update category | Admin |
| DELETE | `/:id` | Delete category | Admin |

**Request Body (Create/Update):**
```json
{
  "name": "Beverages",
  "nameOr": "Dhugaatii",
  "nameAm": "መጠጦች",
  "nameSo": "Cabitaanno",
  "nameAr": "مشروبات"
}
```

### Product Routes (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all products | No |
| GET | `/menu` | Get products visible in menu | No |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| PUT | `/:id/toggle-menu` | Toggle menu visibility | Admin |
| DELETE | `/:id` | Delete product | Admin |

**Request Body (Create/Update):**
```json
{
  "name": "Coffee",
  "nameOr": "Buna",
  "nameAm": "ቡና",
  "nameSo": "Qaxwe",
  "nameAr": "قهوة",
  "description": "Fresh brewed coffee",
  "descriptionOr": "Buna haaraa",
  "descriptionAm": "ትኩስ የተጠበሰ ቡና",
  "descriptionSo": "Qaxwe cusub",
  "descriptionAr": "قهوة طازجة",
  "price": 25.00,
  "image": "/uploads/coffee.jpg",
  "categoryId": 1,
  "showInMenu": true
}
```

### Order Routes (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all orders (with status filter) | Cashier/Kitchen |
| GET | `/:id` | Get order by ID | Cashier/Kitchen |
| GET | `/stats` | Get order statistics | Admin |
| POST | `/` | Create new order | Cashier |
| PUT | `/:id/status` | Update order status | Kitchen |
| PUT | `/:id/priority` | Update order priority | Cashier |
| DELETE | `/:id` | Delete order | Admin |

**Request Body (Create Order):**
```json
{
  "tableNumber": "T-05",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 25.00
    }
  ],
  "notes": "No sugar",
  "priority": "normal"
}
```

**Order Status Values:** `pending`, `preparing`, `ready`, `completed`, `cancelled`

**Priority Values:** `low`, `normal`, `high`

### QR Code Routes (`/api/qrcodes`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all QR codes | Admin |
| POST | `/` | Generate QR code | Admin |
| DELETE | `/:id` | Delete QR code | Admin |

**Request Body (Generate QR Code):**
```json
{
  "name": "Table 5",
  "url": "http://localhost:5173/?table=5",
  "description": "QR code for table 5"
}
```

### Upload Routes (`/api/upload`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Upload product image | Admin |

**Request:** Multipart form-data with `image` field

## 🗄️ Database Schema

### Enhanced Security Models

#### User Models (with Security Fields)
- **Admin**: System administrators
  - Security fields: `isActive`, `failedLoginCount`, `lockedUntil`, `lastLoginAt`, `lastLoginIp`, `passwordChangedAt`
- **Cashier**: POS operators
  - Security fields: Same as Admin
- **Kitchen**: Kitchen staff
  - Security fields: Same as Admin

#### Security Tables
- **RefreshToken**: Stores refresh tokens with expiry, revocation status, IP, and user agent
- **AuditLog**: Comprehensive audit trail of all system actions
- **PasswordResetToken**: Password reset functionality (future use)

#### Business Models
- **Category**: Product categories (multi-language)
- **Product**: Menu items (multi-language)
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items in orders
- **QRCode**: Generated QR codes for tables

### Multi-Language Support
Categories and Products support 5 languages:
- English (default)
- Afaan Oromo (`nameOr`, `descriptionOr`)
- Amharic (`nameAm`, `descriptionAm`)
- Somali (`nameSo`, `descriptionSo`)
- Arabic (`nameAr`, `descriptionAr`)

## 🔐 Authentication

The system uses **JWT-based authentication with refresh tokens** and three user roles:

### Authentication Flow
1. User logs in with credentials
2. Backend validates and generates:
   - Access token (15 minutes) - stored in HttpOnly cookie
   - Refresh token (7 days) - stored in HttpOnly cookie
3. Access token used for API requests
4. When access token expires, refresh token automatically generates new tokens
5. Logout revokes all tokens

### User Roles & Permissions

#### Admin
- Full system access
- User management (create/edit/delete cashiers and kitchen staff)
- Product and category management
- QR code generation
- Order monitoring
- System settings
- Audit log access

#### Cashier
- Create and manage orders
- View products and categories
- View own order history
- Access POS system

#### Kitchen
- View incoming orders
- Update order status (preparing, ready, completed)
- View order queue
- Access kitchen display system

### Security Features
- **Account Lockout**: 5 failed attempts → 30-minute lockout
- **Session Management**: View and revoke active sessions
- **Audit Logging**: All actions tracked with IP and timestamp
- **Token Rotation**: Refresh tokens rotate on each use
- **Role Validation**: Strict role-based access control

## 📱 User Flows

### Admin Flow
1. Login at `/admin-login` with modern animated interface
2. Access comprehensive dashboard with statistics
3. Manage categories and products with multi-language support
4. Generate and print QR codes for tables
5. Control menu visibility for products
6. **Settings Tab**: Manage all user accounts
   - Update admin credentials
   - Create/edit/delete cashier accounts
   - Create/edit/delete kitchen staff accounts
7. Monitor orders and system activity

### Cashier Flow
1. Login at `/cashier-login`
2. Create orders for customers
3. Assign table numbers
4. Track order status

### Kitchen Flow
1. Login at `/kitchen-login`
2. View incoming orders
3. Accept and prepare orders
4. Mark orders as ready/completed

### Customer Flow
1. Scan QR code at table
2. Browse menu in preferred language
3. View products by category
4. Place order (via cashier)

## 🔧 Development Scripts

### Backend
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Production start
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/restaurant_db

# JWT Secrets (MUST be different and strong - min 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-random-string
JWT_REFRESH_SECRET=your-different-refresh-secret-min-32-chars-random

# Environment
NODE_ENV=development  # Use 'production' in production

# CORS (comma-separated origins, no wildcards in production)
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Server
PORT=3001
```

**Generate Strong Secrets:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET (must be different)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

**Production Environment:**
```env
# Backend
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=postgresql://user:password@prod-host:5432/restaurant_db?ssl=true

# Frontend
VITE_API_URL=https://api.yourdomain.com/api
```

## 🎯 Application Routes

### Frontend Routes
| Route | Component | Description | Access |
|-------|-----------|-------------|--------|
| `/` | Home | Customer menu with QR code access | Public |
| `/admin/login` | AdminLogin | Modern animated admin login | Public |
| `/admin` | Admin | Admin dashboard with Settings tab | Admin only |
| `/cashier/login` | CashierLogin | Modern animated cashier login | Public |
| `/cashier` | Cashier | Cashier POS system | Cashier only |
| `/kitchen/login` | KitchenLogin | Modern animated kitchen login | Public |
| `/kitchen` | Kitchen | Kitchen display system | Kitchen only |

### Admin Dashboard Tabs
| Tab | Description |
|-----|-------------|
| Dashboard | Statistics overview with quick actions |
| Categories | Multi-language category management |
| Products | Product CRUD with image upload |
| Digital Menu | Toggle product visibility in customer menu |
| QR Codes | Generate, view, print QR codes |
| **Settings** | User management (Admin, Cashiers, Kitchen) |

## 🔑 Default Credentials (After Seeding)

```
Admin:
Email: ibrahimkamil362@gmail.com
Password: Admin@123
Dashboard: http://localhost:5173/admin

Cashier:
Username: cashier
Password: Cashier@123
Dashboard: http://localhost:5173/cashier

Kitchen:
Username: kitchen
Password: Kitchen@123
Dashboard: http://localhost:5173/kitchen
```

**⚠️ CRITICAL SECURITY NOTICE:**
1. **Change these passwords immediately** after first login
2. Use strong, unique passwords (min 8 chars with uppercase, lowercase, number, special char)
3. Never commit credentials to version control
4. Use environment variables for sensitive data
5. Enable 2FA in production (future enhancement)

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

## 📊 Order Workflow

```
1. Customer scans QR code → Views menu
2. Cashier creates order → Status: PENDING
3. Kitchen receives order → Accepts → Status: PREPARING
4. Kitchen completes cooking → Status: READY
5. Order delivered → Status: COMPLETED
```

**Status Transitions:**
- `pending` → Order created by cashier
- `preparing` → Kitchen accepted and cooking (tracks `acceptedAt`)
- `ready` → Food ready for pickup/delivery
- `completed` → Order delivered to customer (tracks `completedAt`)
- `cancelled` → Order cancelled

## 🌍 Multi-Language Implementation

The platform supports 5 languages with database-level storage:

| Language | Code | Fields |
|----------|------|--------|
| English | (default) | `name`, `description` |
| Afaan Oromo | `or` | `nameOr`, `descriptionOr` |
| Amharic | `am` | `nameAm`, `descriptionAm` |
| Somali | `so` | `nameSo`, `descriptionSo` |
| Arabic | `ar` | `nameAr`, `descriptionAr` |

**Supported Models:**
- Categories (name translations)
- Products (name and description translations)

## 🔒 Security Features

### Production-Ready Security Implementation

This system implements **enterprise-grade security** with comprehensive protection against common vulnerabilities:

#### Authentication & Authorization
- **JWT with Refresh Tokens**: Short-lived access tokens (15 minutes) + long-lived refresh tokens (7 days)
- **HttpOnly Cookies**: Prevents XSS attacks by storing tokens in secure, HttpOnly cookies
- **Token Rotation**: Automatic refresh token rotation on each refresh for enhanced security
- **Role-Based Access Control (RBAC)**: Strict role separation (Admin, Cashier, Kitchen)
- **Session Management**: Track and revoke active sessions, view login history

#### Password Security
- **Strong Hashing**: bcryptjs with 12 salt rounds (production-grade)
- **Password Policy**: Enforced complexity requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- **Account Lockout**: Automatic lockout after 5 failed login attempts (30-minute duration)
- **Failed Login Tracking**: Monitor and log all authentication attempts

#### API Security
- **Rate Limiting**: 
  - Global: 100 requests per 15 minutes
  - Auth endpoints: 5 requests per 15 minutes
  - API endpoints: 30 requests per minute
- **Security Headers**: Helmet middleware with CSP, HSTS, X-Frame-Options, etc.
- **CORS Whitelist**: Strict origin validation (no wildcards in production)
- **Input Sanitization**: XSS prevention through input cleaning
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Content-Type Validation**: Ensures proper request formats

#### Audit & Monitoring
- **Comprehensive Audit Logging**: 
  - All login attempts (success/failure)
  - Admin CRUD operations
  - Order status changes
  - Unauthorized access attempts
  - IP address and user agent tracking
- **Security Events**: Account lockouts, token refresh, password changes
- **Audit Trail**: Complete history of all sensitive actions

#### Additional Security Measures
- **Protected Routes**: Middleware authentication on all sensitive endpoints
- **Token Blacklist**: Revoked tokens tracked in database
- **Secure Cookies**: SameSite=Strict, Secure flag in production
- **Password Visibility Toggle**: Secure password input with show/hide option
- **Unique Constraints**: Username/email uniqueness enforced at database level
- **Account Status**: Active/inactive user management

### Security Documentation

For detailed security information, see:
- `SECURITY_ARCHITECTURE.md` - Complete security architecture
- `PRODUCTION_SECURITY_CHECKLIST.md` - Pre-deployment security checklist
- `IMPLEMENTATION_GUIDE.md` - Security implementation guide
- `TEST_SECURITY.md` - Security testing procedures

## 📈 Order Statistics API

The `/api/orders/stats` endpoint provides:
- Total orders count
- Orders by status (pending, preparing, ready, completed, cancelled)
- Total revenue from completed orders
- Real-time analytics for admin dashboard

## 📝 Additional Notes

- Product images stored in `backend/uploads/` directory
- Images served statically via Express
- QR codes generated with base64 data URLs
- Order timestamps tracked: `createdAt`, `acceptedAt`, `completedAt`
- Cascade delete: Deleting category removes all products
- Cascade delete: Deleting order removes all order items
- Menu visibility toggle: Control which products appear in customer menu
- Priority system: Visual indicators for urgent orders
- **Modern Login Pages**: All login pages feature animated designs with:
  - Framer Motion animations
  - Lucide React icons
  - Gradient backgrounds
  - Password visibility toggles
  - Loading states
  - Unique color themes per role (Indigo/Admin, Emerald/Cashier, Orange/Kitchen)
- **Settings Management**: Centralized user account management in admin dashboard
- **Password Updates**: Optional password fields - leave empty to keep current password

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Regenerate Prisma client
npx prisma generate
```

**Port Already in Use**
```bash
# Backend (3001)
# Frontend (5173)
# Kill process or change PORT in .env
```

**Prisma Migration Issues**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name
```

**Image Upload Not Working**
- Ensure `backend/uploads/` directory exists
- Check file permissions
- Verify Multer configuration

**Authentication Errors**
- Check JWT_SECRET is set in .env
- Verify token is included in request headers
- Check token expiration

**CORS Issues**
- Verify frontend URL in CORS configuration
- Check API endpoint URLs in frontend

For backend restart instructions, see `RESTART_BACKEND.md`

## 🚀 Deployment Considerations

### Security Checklist (CRITICAL)
Before deploying to production, complete the security checklist in `PRODUCTION_SECURITY_CHECKLIST.md`:

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets (32+ characters, random)
- [ ] Set `NODE_ENV=production`
- [ ] Configure HTTPS/SSL certificates
- [ ] Update CORS_ORIGIN with production URLs (no wildcards)
- [ ] Enable secure cookie flags
- [ ] Configure database SSL connection
- [ ] Set up monitoring and alerting
- [ ] Configure automated backups
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Test all security features
- [ ] Review audit logs
- [ ] Set up rate limiting at infrastructure level
- [ ] Configure DDoS protection
- [ ] Set up log aggregation

### Backend
- Set `NODE_ENV=production`
- Use process manager (PM2, systemd)
- Configure PostgreSQL for production with SSL
- Set strong, unique JWT secrets
- Enable HTTPS with valid SSL certificate
- Configure proper CORS origins (no wildcards)
- Set up database backups and replication
- Configure monitoring (error tracking, uptime, performance)
- Set up log rotation and retention
- Use environment variables for all secrets
- Configure firewall rules
- Enable rate limiting at infrastructure level

### Frontend
- Build for production: `npm run build`
- Serve with Nginx or similar web server
- Update API URLs for production
- Enable HTTPS with valid SSL certificate
- Configure CDN for static assets
- Enable gzip/brotli compression
- Set proper cache headers
- Configure CSP headers

### Database
- Regular automated backups
- Connection pooling configuration
- Index optimization for performance
- Monitor query performance
- Set up replication for high availability
- Enable SSL/TLS connections
- Restrict database access by IP
- Regular security updates

### Monitoring & Maintenance
- Set up error tracking (Sentry, etc.)
- Configure uptime monitoring
- Set up performance monitoring (APM)
- Monitor audit logs for suspicious activity
- Set up alerts for:
  - Failed login attempts
  - Account lockouts
  - Rate limit violations
  - Server errors
  - Database issues
- Regular security audits
- Keep dependencies updated
- Review and rotate JWT secrets quarterly

## 🔄 Future Enhancements

### Security
- Two-factor authentication (2FA)
- Biometric authentication
- Password reset via email
- Session timeout configuration
- IP whitelisting for admin access
- Advanced threat detection
- Security incident response automation

### Features
- Real-time WebSocket updates for orders
- Payment gateway integration
- Customer order history and loyalty program
- Inventory management with low-stock alerts
- Advanced sales reports and analytics
- Email/SMS notifications for orders
- Table reservation system
- Mobile apps (iOS/Android)
- Print receipt functionality
- Platform branding customization (logo, name, colors)
- Multi-location support
- Staff scheduling and time tracking
- Customer feedback and ratings
- Integration with delivery platforms

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is for educational/commercial use.

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Check database schema
- Verify environment variables

---

**Built with ❤️ for modern restaurants**
