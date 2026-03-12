# 🍽️ Restaurant Management System

> A comprehensive full-stack restaurant management platform with enterprise-grade security, stunning UI/UX animations, and multi-language support. Features an intuitive admin dashboard, dynamic customer menu with QR code access, and complete restaurant branding customization.

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🔒 IMPORTANT: Fix "Not Secure" Warning

**Is your site showing "Not secure" in the browser?** 

👉 **[Click here for the quick SSL fix guide](FIX_SSL_NOW.md)**

Your site needs HTTPS enabled. Run this one command on your VPS:
```bash
ssh root@76.13.48.245
cd /var/www/digital_menu && ./deploy/enable-ssl-now.sh
```

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [UI/UX Design System](#-uiux-design-system)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [Multi-Language Support](#-multi-language-support)
- [User Flows](#-user-flows)
- [Deployment](#-deployment)

---

## 🌟 Overview

This Restaurant Management System is a modern, production-ready platform designed for restaurants to manage their operations efficiently while providing customers with an exceptional digital menu experience. Built with cutting-edge technologies and best practices, it combines powerful backend functionality with a beautiful, animated frontend.

### What Makes This Special?

- **Enterprise Security**: JWT authentication, refresh tokens, account lockout, audit logging
- **Stunning UI/UX**: Framer Motion animations, glassmorphism design, dark/light modes
- **Multi-Language**: Support for 5 languages (English, Afaan Oromo, Amharic, Somali, Arabic)
- **Fully Customizable**: Restaurant branding, colors, logo, and complete theme control
- **QR Code Integration**: Generate QR codes for tables with instant menu access
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Production Ready**: Rate limiting, security headers, CORS, input sanitization


---

## ✨ Key Features

### 🎨 Modern UI/UX Design

#### Visual Design
- **Glassmorphism Effects**: Modern backdrop blur with subtle borders and transparency
- **Smooth Animations**: 60fps animations powered by Framer Motion
- **Dark/Light Mode**: Seamless theme switching with persistent preferences
- **Gradient Designs**: Beautiful multi-color gradients throughout the interface
- **Responsive Layout**: Mobile-first design optimized for all screen sizes
- **Interactive Elements**: Hover effects, scale animations, and micro-interactions
- **Icon System**: 50+ Lucide React icons for intuitive navigation
- **Dynamic Theming**: Customizable primary colors that affect the entire app

#### Animation System
- Page transitions with fade and slide effects
- Staggered card entrance animations
- Button scale effects on hover and tap
- Modal spring-based animations
- Loading spinners with smooth rotation
- Smooth color transitions between themes
- Image carousel with swipe gestures

#### Design Patterns
- Glass morphism cards with backdrop blur
- Elevated shadows for depth perception
- Rounded corners (16px-32px) for modern feel
- Consistent spacing using Tailwind scale
- Color-coded status indicators
- Badge system for categories and counts
- Empty states with friendly messages


### 👨‍💼 Admin Dashboard

#### Dashboard Tab
- **Real-time Statistics**: Animated cards showing key metrics
  - Total products count with trending indicators
  - Category count with visual icons
  - Menu visibility tracking
  - QR code generation statistics
- **Quick Actions**: One-click access to common tasks
- **Welcome Banner**: Personalized greeting with gradient design
- **Visual Analytics**: Color-coded statistics with icon badges

#### Category Management
- **Multi-language Support**: Create categories in 5 languages
- **CRUD Operations**: Full create, read, update, delete functionality
- **Visual Cards**: Category cards with hover effects and shadows
- **Instant Feedback**: Success/error toast notifications
- **Cascade Delete**: Automatic cleanup of related products

#### Product Management
- **Multi-language Product Info**: Names and descriptions in 5 languages
- **Multiple Image Upload**: Support for up to 10 images per product
- **Image Gallery**: Thumbnail preview with individual remove functionality
- **Image Counter**: Visual indicator showing number of images
- **Price Management**: Decimal precision pricing with validation
- **Category Assignment**: Dropdown selection with real-time validation
- **Rich Descriptions**: Multi-line text areas for detailed descriptions
- **Product Cards**: Beautiful cards with image previews and badges
- **Edit Mode**: Inline editing with pre-filled forms

#### Digital Menu Control
- **Visibility Toggle**: Show/hide products from customer menu
- **Visual Indicators**: Green badges for visible items
- **Bulk Management**: Manage all products from one view
- **Live Preview Link**: Direct link to customer menu
- **Image Gallery Preview**: See all product images at a glance

#### QR Code Generator
- **Custom QR Codes**: Generate QR codes for any URL
- **Table Management**: Create unique codes for each table
- **QR Preview**: Large, clear QR code display
- **Print Functionality**: One-click print with formatted layout
- **QR Details**: Name, description, and URL tracking
- **View Modal**: Full-screen QR code viewing
- **Download Support**: Save QR codes for external use

#### Settings Tab
- **Admin Credentials Management**:
  - Update email, password, and name
  - Password visibility toggle
  - Copy to clipboard functionality
  - Strong password validation
  - Optional password updates (leave empty to keep current)
- **Restaurant Branding**:
  - Custom restaurant name and subname
  - Logo upload with preview
  - Primary color picker with live preview
  - Brand consistency across entire app
- **Security Features**:
  - Password strength requirements
  - Email validation
  - Secure credential updates


### 📱 Customer Menu (QR Code Access)

#### Navigation & Branding
- **Custom Branding**: Restaurant logo, name, and colors
- **Language Selector**: Dropdown with 5 language options and flags
  - 🇬🇧 English
  - 🇪🇹 Afaan Oromo
  - 🇪🇹 አማርኛ (Amharic)
  - 🇸🇴 Soomaali (Somali)
  - 🇸🇦 العربية (Arabic with RTL support)
- **Dark/Light Toggle**: Persistent theme preference with smooth transitions
- **Sticky Navigation**: Always accessible header with backdrop blur
- **Animated Logo**: Rotating chef hat icon with gradient background

#### Menu Browsing
- **Search Functionality**: Real-time product search with icon
- **Category Filters**: Animated filter buttons with active states
- **Product Grid**: 5-column desktop, 2-column mobile responsive layout
- **Product Cards**: 
  - High-quality image display or gradient placeholder
  - Product name with multi-language support
  - Category badge with custom colors
  - Price display with dollar icon
  - Hover animations (lift and scale effects)
  - Star rating indicators
  - Info icon for details

#### Product Detail Modal
- **Image Carousel**: 
  - Multiple image support with smooth transitions
  - Navigation arrows (previous/next)
  - Thumbnail strip with active indicator
  - Image counter badge (e.g., "2 / 5")
  - Full-screen image display
- **Product Information**:
  - Large product title with localized text
  - Category badge with custom branding
  - 5-star rating display
  - Price section with gradient background
  - Detailed description with localization
  - Product details grid (category, prep time, availability, serving size)
- **Action Buttons**:
  - "Order Now" button with gradient and shadow
  - Share functionality
  - Favorite/wishlist option
  - Responsive button layout

#### Visual Design
- **Gradient Backgrounds**: Smooth color transitions
- **Card Shadows**: Layered shadow effects for depth
- **Backdrop Blur**: Modern glass morphism effects
- **Smooth Animations**: Framer Motion for all interactions
- **Loading States**: Rotating spinner with branded colors
- **Empty States**: Friendly "no items" messages with emojis
- **Footer Section**: Restaurant name, credits, version, copyright

#### Responsive Design
- **Mobile-First**: Optimized for touch interactions
- **Tablet Support**: Adaptive grid layouts
- **Desktop Experience**: Multi-column layouts with hover effects
- **Touch Gestures**: Swipe support for image carousel
- **Viewport Optimization**: Proper scaling on all devices


---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  React 19.2 + Vite 8.0 + Tailwind CSS 4.2                  │
│  • Framer Motion (Animations)                                │
│  • React Router DOM (Routing)                                │
│  • Axios (HTTP Client with Interceptors)                     │
│  • Lucide React (Icons)                                      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Express.js 4.18 + Security Middleware                      │
│  • Helmet (Security Headers)                                 │
│  • CORS (Cross-Origin Resource Sharing)                      │
│  • Rate Limiting (DDoS Protection)                           │
│  • Input Sanitization (XSS Prevention)                       │
│  • Cookie Parser (Secure Cookies)                            │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  Controllers + Services                                      │
│  • Authentication (JWT + Refresh Tokens)                     │
│  • Authorization (Role-Based Access Control)                 │
│  • Product Management                                        │
│  • Category Management                                       │
│  • Order Processing                                          │
│  • QR Code Generation                                        │
│  • Settings Management                                       │
│  • Audit Logging                                             │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Prisma ORM 5.9                                              │
│  • Type-safe database queries                                │
│  • Migration management                                      │
│  • Connection pooling                                        │
│  • Transaction support                                       │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL                                                  │
│  • Relational data storage                                   │
│  • ACID compliance                                           │
│  • Indexing for performance                                  │
│  • Cascade delete relationships                              │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
Customer Scans QR Code
        ↓
Frontend Loads Menu (/)
        ↓
Fetch Products (GET /api/products/menu)
        ↓
Display with Branding (GET /api/settings/restaurant)
        ↓
User Selects Language → Content Updates
        ↓
User Clicks Product → Modal Opens
        ↓
Image Carousel + Details Display
```

```
Admin Login (/admin/login)
        ↓
POST /api/auth/admin/login
        ↓
JWT Tokens Set in HttpOnly Cookies
        ↓
Redirect to Dashboard (/admin)
        ↓
Protected Route Validates Token
        ↓
Dashboard Loads with Statistics
        ↓
Admin Performs Actions (CRUD)
        ↓
Audit Log Records Action
```


---

## 🛠️ Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework with latest features |
| **Vite** | 8.0 beta | Ultra-fast build tool and dev server |
| **Tailwind CSS** | 4.2.1 | Utility-first CSS framework |
| **Framer Motion** | 12.34.3 | Animation library for smooth transitions |
| **React Router DOM** | 7.13.1 | Client-side routing |
| **Axios** | 1.13.6 | HTTP client with interceptors |
| **Lucide React** | 0.575.0 | Icon library (50+ icons) |
| **Recharts** | 3.8.0 | Charting library for analytics |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | 4.18.2 | Web application framework |
| **Prisma** | 5.9.0 | Next-generation ORM |
| **PostgreSQL** | Latest | Relational database |
| **JWT** | 9.0.2 | JSON Web Tokens for auth |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Multer** | 2.1.0 | File upload handling |
| **QRCode** | 1.5.4 | QR code generation |
| **Helmet** | 8.1.0 | Security headers |
| **express-rate-limit** | 8.2.1 | Rate limiting middleware |
| **cookie-parser** | 1.4.7 | Cookie parsing |
| **cors** | 2.8.5 | Cross-origin resource sharing |

### Development Tools

- **ESLint**: Code linting and formatting
- **Nodemon**: Auto-restart on file changes
- **dotenv**: Environment variable management
- **Prisma Studio**: Database GUI


---

## 📂 Project Structure

```
restaurant-management-system/
│
├── backend/                          # Backend Node.js application
│   ├── src/
│   │   ├── app.js                   # Express app entry point
│   │   ├── config/
│   │   │   └── database.js          # Database configuration
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── categoryController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   ├── qrcodeController.js
│   │   │   └── settingsController.js
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.js              # JWT authentication
│   │   │   ├── securityMiddleware.js
│   │   │   └── upload.js            # File upload handling
│   │   ├── routes/                  # API route definitions
│   │   ├── services/                # Business logic
│   │   │   ├── auditService.js      # Audit logging
│   │   │   └── tokenService.js      # Token management
│   │   └── utils/
│   │       └── security.js          # Security utilities
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/              # Database migrations
│   ├── uploads/                     # Uploaded images storage
│   ├── seed.js                      # Database seeding script
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
├── frontend/                         # Frontend React application
│   ├── src/
│   │   ├── main.jsx                 # React entry point
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── index.css                # Global styles
│   │   ├── components/              # Reusable components
│   │   │   ├── LoginForm.jsx        # Login form component
│   │   │   └── ProtectedRoute.jsx   # Route protection wrapper
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Customer menu (945 lines)
│   │   │   ├── Admin.jsx            # Admin dashboard (1341 lines)
│   │   │   └── AdminLogin.jsx       # Admin login page
│   │   └── utils/
│   │       └── auth.js              # Auth utilities
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── vite.config.js               # Vite configuration
│   └── .env                         # Environment variables
│
└── README.md                         # Project documentation
```

### Key File Descriptions

#### Backend Files
- **app.js**: Express server setup with middleware, routes, and error handling
- **authController.js**: Handles admin login, token refresh, logout, and session management
- **productController.js**: CRUD operations for products with multi-language support
- **categoryController.js**: Category management with cascade delete
- **qrcodeController.js**: QR code generation and management
- **settingsController.js**: Admin and restaurant settings management
- **auth.js**: JWT verification middleware with role-based access control
- **securityMiddleware.js**: Rate limiting, input sanitization, security headers
- **auditService.js**: Logs all admin actions for security auditing
- **tokenService.js**: Manages refresh tokens and token rotation

#### Frontend Files
- **App.jsx**: Main routing configuration with protected routes
- **Home.jsx**: Customer-facing digital menu with 945 lines of code including:
  - Multi-language support (5 languages)
  - Product browsing with search and filters
  - Image carousel for product details
  - Dark/light mode toggle
  - Restaurant branding integration
- **Admin.jsx**: Complete admin dashboard with 1341 lines including:
  - Dashboard with statistics
  - Category management (CRUD)
  - Product management with multi-image upload
  - Digital menu visibility control
  - QR code generator
  - Settings management (admin credentials + restaurant branding)
- **ProtectedRoute.jsx**: Route guard component for authentication
- **auth.js**: Client-side authentication utilities and token management


---

## 🎨 UI/UX Design Philosophy

### Design Principles

#### 1. Modern Glassmorphism
- Backdrop blur effects for depth and elegance
- Semi-transparent cards with subtle borders
- Layered shadows for visual hierarchy
- Frosted glass aesthetic throughout

#### 2. Smooth Animations (60fps)
- **Page Transitions**: Fade and slide effects using Framer Motion
- **Card Entrance**: Staggered animations with delay multipliers
- **Hover Effects**: Scale, lift, and color transitions
- **Modal Animations**: Spring-based physics for natural feel
- **Loading States**: Rotating spinners with branded colors
- **Button Interactions**: Scale on tap, lift on hover

#### 3. Color System
- **Primary Brand Color**: Customizable via settings (default: Amber #d97706)
- **Dark Mode**: Gray-900 backgrounds with amber accents
- **Light Mode**: Warm gradients (amber-50, orange-50, yellow-50)
- **Semantic Colors**: 
  - Success: Green-600
  - Error: Red-600
  - Warning: Amber-600
  - Info: Blue-600

#### 4. Typography
- **Headings**: Bold, large sizes (2xl-4xl) for hierarchy
- **Body Text**: Medium weight, readable sizes (base-lg)
- **Labels**: Semibold, small sizes (sm) for form fields
- **Gradients**: Text gradients for emphasis using bg-clip-text

#### 5. Spacing & Layout
- **Consistent Scale**: Tailwind spacing (4, 6, 8, 12, 16, 24, 32)
- **Rounded Corners**: 16px-32px for modern feel
- **Grid Systems**: 
  - Mobile: 2 columns
  - Tablet: 3 columns
  - Desktop: 4-5 columns
- **Padding**: Generous padding (p-6, p-8) for breathing room

#### 6. Interactive Elements
- **Buttons**: 
  - Gradient backgrounds with shadow
  - Scale animations on hover/tap
  - Icon + text combinations
  - Loading states with spinners
- **Cards**: 
  - Hover lift effect (y: -10px)
  - Shadow increase on hover
  - Border highlights
  - Clickable with cursor pointer
- **Forms**: 
  - Focus rings with brand color
  - Validation feedback
  - Placeholder text
  - Clear error messages

#### 7. Responsive Design
- **Mobile-First**: Optimized for touch interactions
- **Breakpoints**: 
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- **Touch Targets**: Minimum 44x44px for accessibility
- **Viewport Optimization**: Proper scaling on all devices


### Component Design Patterns

#### Navigation Bar
- Sticky positioning for always-accessible navigation
- Backdrop blur for modern aesthetic
- Restaurant logo/icon with gradient background
- Language selector dropdown with flags
- Dark/light mode toggle with icon rotation
- Responsive layout (mobile hamburger menu ready)

#### Product Cards
- Image or gradient placeholder
- Product name with line-clamp for overflow
- Price with dollar icon
- Category badge with brand colors
- Star rating indicators
- Hover effects (lift + scale)
- Click to open detail modal

#### Modal System
- Full-screen overlay with backdrop blur
- Spring-based entrance animation
- Close button with rotation on hover
- Click outside to dismiss
- Scroll support for long content
- Responsive sizing

#### Form Design
- Clear labels with semibold weight
- Large input fields (p-4) for easy interaction
- Focus states with ring effects
- Validation feedback (inline errors)
- Submit buttons with loading states
- Multi-language input fields grouped logically

#### Dashboard Statistics
- Animated stat cards with icons
- Color-coded borders (left border accent)
- Trending indicators
- Hover lift effect
- Icon badges with background colors
- Large numbers for quick scanning


### Animation Specifications

#### Timing Functions
- **Default**: ease-in-out
- **Spring**: damping: 25, stiffness: 300
- **Duration**: 0.3s for most transitions
- **Delay**: Staggered by 0.05s-0.1s for lists

#### Motion Variants
```javascript
// Card entrance
initial: { opacity: 0, scale: 0.9 }
animate: { opacity: 1, scale: 1 }
exit: { opacity: 0, scale: 0.9 }

// Page transition
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -20 }

// Hover effect
whileHover: { y: -10, scale: 1.02 }

// Tap effect
whileTap: { scale: 0.95 }
```

#### Loading States
- Rotating spinner (360deg infinite)
- Branded colors (amber-600)
- Transparent border-t for spinner effect
- Centered with text below


### Accessibility Features

- **Keyboard Navigation**: Tab order and focus states
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Color Contrast**: WCAG AA compliant
- **Touch Targets**: Minimum 44x44px
- **Focus Indicators**: Visible focus rings
- **Alt Text**: All images have descriptive alt text
- **Form Labels**: Properly associated with inputs


### User Experience Flows

#### Customer Journey (Home Page)
1. Scan QR code → Land on menu
2. See restaurant branding (logo, name, colors)
3. Select preferred language from dropdown
4. Toggle dark/light mode if desired
5. Browse products by category or search
6. Click product card → View details in modal
7. Navigate through product images in carousel
8. Read description and see price
9. Close modal or continue browsing

#### Admin Journey (Dashboard)
1. Navigate to /admin/login
2. Enter credentials (email + password)
3. JWT tokens set in HttpOnly cookies
4. Redirect to dashboard with statistics
5. Navigate between tabs (Dashboard, Categories, Products, Menu, QR Codes, Settings)
6. Perform CRUD operations with instant feedback
7. Upload images with preview
8. Generate QR codes with print functionality
9. Update restaurant branding and admin credentials
10. Logout securely


### Performance Optimizations

- **Code Splitting**: React.lazy for route-based splitting
- **Image Optimization**: Proper sizing and lazy loading
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search input with debounce
- **Pagination**: Ready for large datasets
- **Caching**: Axios interceptors for response caching
- **Bundle Size**: Tree-shaking with Vite
- **CSS Purging**: Tailwind removes unused styles



---

## 📦 Installation & Deployment

### Local Development Setup

#### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
PORT=5050
EOF

# Run database migrations
npx prisma generate
npx prisma migrate deploy

# Seed database (optional)
node seed.js

# Start development server
npm run dev
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo 'VITE_API_URL=http://localhost:5050/api' > .env

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5050/api
- Admin Panel: http://localhost:5173/admin/login

---

### 🚀 Production Deployment

#### Prerequisites
- PostgreSQL database URL
- Domain name or server IP
- Root/sudo access to VPS
- Node.js 18+ installed

#### Deployment Steps

##### 1. Server Prerequisites
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 and Nginx
npm install -g pm2
apt install -y nginx postgresql-client
```

##### 2. Clone Repository
```bash
cd /var/www
git clone https://github.com/ibrahim362-ai/digital_menu.git
cd digital_menu
```

##### 3. Backend Configuration
```bash
cd backend
npm install

# Create production .env
cat > .env << 'EOF'
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
JWT_SECRET="your-production-secret"
JWT_REFRESH_SECRET="your-production-refresh-secret"
NODE_ENV="production"
CORS_ORIGIN="https://yourdomain.com"
PORT=5050
EOF

# Run migrations
npx prisma generate
npx prisma migrate deploy

# Start with PM2
pm2 start src/app.js --name "digital-menu-backend"
pm2 save
pm2 startup
```

##### 4. Frontend Configuration
```bash
cd ../frontend
npm install

# Create production .env
echo 'VITE_API_URL=https://yourdomain.com/api' > .env

# Build
npm run build

# Deploy to web directory
mkdir -p /var/www/html/digital-menu
cp -r dist/* /var/www/html/digital-menu/
chown -R www-data:www-data /var/www/html/digital-menu
chmod -R 755 /var/www/html/digital-menu
```

##### 5. Nginx Configuration
```bash
cat > /etc/nginx/sites-available/digital-menu << 'EOF'
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/html/digital-menu;
    index index.html;

    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5050/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:5050/uploads/;
        proxy_set_header Host $host;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/digital-menu /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart
nginx -t
systemctl restart nginx
```

##### 6. SSL Certificate (Optional but Recommended)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

---

### 🔍 Verification & Troubleshooting

#### Check Deployment Status
```bash
# Check backend status
pm2 status
pm2 logs digital-menu-backend

# Test backend health
curl http://localhost:5050/api/health

# Check Nginx status
systemctl status nginx
nginx -t

# View logs
tail -f /var/log/nginx/error.log
```

#### Common Issues

**Backend not starting:**
```bash
cd /var/www/digital_menu/backend
pm2 logs digital-menu-backend
# Check for database connection errors or missing dependencies
```

**403 Forbidden error:**
```bash
chown -R www-data:www-data /var/www/html/digital-menu
chmod -R 755 /var/www/html/digital-menu
```

**API connection errors:**
- Verify CORS_ORIGIN in backend .env includes your domain
- Check VITE_API_URL in frontend .env points to correct API URL
- Ensure backend is running on port 5050

**Database connection issues:**
```bash
# Test database connection
cd /var/www/digital_menu/backend
npx prisma db pull
```

---

### 🔄 Updating Deployment

```bash
# Pull latest changes
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

---

### 📊 Monitoring & Maintenance

#### PM2 Commands
```bash
pm2 status                      # View all processes
pm2 logs digital-menu-backend   # View logs
pm2 restart digital-menu-backend # Restart backend
pm2 stop digital-menu-backend   # Stop backend
pm2 delete digital-menu-backend # Remove process
pm2 monit                       # Real-time monitoring
```

#### Database Backup
```bash
# Backup database
pg_dump -h host -U user -d database > backup.sql

# Restore database
psql -h host -U user -d database < backup.sql
```

#### Log Rotation
```bash
# Nginx logs
logrotate /etc/logrotate.d/nginx

# PM2 logs
pm2 flush  # Clear logs
pm2 install pm2-logrotate  # Auto log rotation
```

---

## 🌐 API Documentation

### Authentication Endpoints

#### Admin Login
```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "admin": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refreshToken=xxx

Response: 200 OK
{
  "message": "Token refreshed"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

### Product Endpoints

#### Get All Products (Admin)
```http
GET /api/products
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 9.99,
    "categoryId": 1,
    "showInMenu": true
  }
]
```

#### Get Menu Products (Public)
```http
GET /api/products/menu

Response: 200 OK
[
  {
    "id": 1,
    "name": "Product Name",
    "nameOr": "Maqaa Oomishaa",
    "price": 9.99,
    "image": "/uploads/image.jpg",
    "category": {
      "id": 1,
      "name": "Category"
    }
  }
]
```

#### Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Product",
  "nameOr": "Oomisha Haaraa",
  "price": 15.99,
  "categoryId": 1,
  "description": "Product description",
  "showInMenu": true
}

Response: 201 Created
```

#### Update Product
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 19.99
}

Response: 200 OK
```

#### Delete Product
```http
DELETE /api/products/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Product deleted successfully"
}
```

### Category Endpoints

#### Get All Categories
```http
GET /api/categories
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "name": "Category Name",
    "nameOr": "Maqaa Ramaddii"
  }
]
```

#### Create Category
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Category",
  "nameOr": "Ramaddii Haaraa",
  "nameAm": "አዲስ ምድብ",
  "nameSo": "Qaybta Cusub",
  "nameAr": "فئة جديدة"
}

Response: 201 Created
```

### Settings Endpoints

#### Get Restaurant Settings (Public)
```http
GET /api/settings/restaurant

Response: 200 OK
{
  "id": 1,
  "name": "Restaurant Name",
  "subname": "Tagline",
  "logo": "/uploads/logo.jpg",
  "primaryColor": "#d97706"
}
```

#### Update Restaurant Settings
```http
PUT /api/settings/restaurant
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Restaurant Name",
  "primaryColor": "#ff6600"
}

Response: 200 OK
```

#### Update Admin Credentials
```http
PUT /api/settings/admin
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "name": "New Name",
  "password": "newpassword123"
}

Response: 200 OK
```

### QR Code Endpoints

#### Get All QR Codes
```http
GET /api/qrcodes
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "name": "Table 1",
    "url": "https://yourdomain.com",
    "qrCodeData": "data:image/png;base64,..."
  }
]
```

#### Create QR Code
```http
POST /api/qrcodes
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Table 5",
  "url": "https://yourdomain.com",
  "description": "QR code for table 5"
}

Response: 201 Created
```

---

## 🗄️ Database Schema

### Models Overview

```prisma
model Admin {
  id                Int       @id @default(autoincrement())
  email             String    @unique
  password          String
  name              String
  isActive          Boolean   @default(true)
  failedLoginCount  Int       @default(0)
  lockedUntil       DateTime?
  lastLoginAt       DateTime?
  lastLoginIp       String?
  passwordChangedAt DateTime  @default(now())
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model Category {
  id        Int       @id @default(autoincrement())
  name      String
  nameOr    String?   // Afaan Oromo
  nameAm    String?   // Amharic
  nameSo    String?   // Somali
  nameAr    String?   // Arabic
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id             Int         @id @default(autoincrement())
  name           String
  nameOr         String?
  nameAm         String?
  nameSo         String?
  nameAr         String?
  description    String?
  descriptionOr  String?
  descriptionAm  String?
  descriptionSo  String?
  descriptionAr  String?
  price          Float
  image          String?
  categoryId     Int
  category       Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  showInMenu     Boolean     @default(false)
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}

model RestaurantSettings {
  id           Int      @id @default(autoincrement())
  name         String   @default("My Restaurant")
  subname      String?
  logo         String?
  primaryColor String   @default("#d97706")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model QRCode {
  id          Int      @id @default(autoincrement())
  name        String
  url         String
  qrCodeData  String   @db.Text
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  userType  String
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  createdAt DateTime @default(now())
  ipAddress String?
  userAgent String?
}

model AuditLog {
  id         Int      @id @default(autoincrement())
  userId     Int
  userType   String
  action     String
  resource   String?
  resourceId Int?
  details    String?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())
}
```

---

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- HttpOnly cookies for token storage
- Token rotation on refresh
- Account lockout after failed login attempts
- Password hashing with bcrypt
- Role-based access control (RBAC)

### Security Middleware
- Helmet.js for security headers
- CORS with whitelist configuration
- Rate limiting (100 requests per 15 minutes)
- Input sanitization to prevent XSS
- SQL injection prevention via Prisma ORM
- Content-Type validation

### Audit Logging
- All admin actions logged
- IP address and user agent tracking
- Failed login attempt monitoring
- Resource access tracking

### Data Protection
- Environment variables for sensitive data
- Secure password requirements
- Session management with automatic expiry
- Refresh token revocation support

---

## 🌍 Multi-Language Support

The system supports 5 languages with complete translations:

| Language | Code | Script | RTL Support |
|----------|------|--------|-------------|
| English | en | Latin | No |
| Afaan Oromo | or | Latin | No |
| Amharic (አማርኛ) | am | Ethiopic | No |
| Somali (Soomaali) | so | Latin | No |
| Arabic (العربية) | ar | Arabic | Yes |

### Implementation
- All product names and descriptions support 5 languages
- Category names translated
- UI language selector with flag icons
- Automatic RTL layout for Arabic
- Language preference persistence in localStorage

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ibrahim**
- GitHub: [@ibrahim362-ai](https://github.com/ibrahim362-ai)
- Repository: [digital_menu](https://github.com/ibrahim362-ai/digital_menu)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Prisma for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- All open-source contributors

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Submit a pull request
- Contact via GitHub profile

---

**Made with ❤️ for restaurants worldwide**
