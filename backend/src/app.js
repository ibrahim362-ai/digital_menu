import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  globalRateLimiter,
  securityHeaders,
  corsOptions,
  sanitizeInputs,
  validateContentType,
  securityErrorHandler,
} from './middleware/securityMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import qrcodeRoutes from './routes/qrcodeRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============= SECURITY MIDDLEWARE =============
app.use(securityHeaders); // Helmet security headers
app.use(cors(corsOptions)); // CORS with whitelist
app.use(cookieParser()); // Parse cookies
app.use(express.json({ limit: '10mb' })); // Body parser with limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../uploads')));

app.use(globalRateLimiter); // Rate limiting
app.use(sanitizeInputs); // Input sanitization
app.use(validateContentType); // Content-Type validation

// ============= ROUTES =============
app.use('/api/auth', authRoutes);
app.use('/api/admin', authRoutes); // Keep old admin routes for backward compatibility
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/qrcodes', qrcodeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============= ERROR HANDLING =============
app.use(securityErrorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 Security features enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

export default app;
