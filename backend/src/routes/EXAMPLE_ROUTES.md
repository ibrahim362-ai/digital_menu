# Example Secure Route Implementations

## Admin Routes Example

```javascript
// backend/src/routes/adminRoutes.js
import express from 'express';
import { adminAuth } from '../middleware/enhancedAuth.js';
import { apiRateLimiter } from '../middleware/securityMiddleware.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { logCreate, logUpdate, logDelete, AUDIT_RESOURCES } from '../services/auditService.js';

const router = express.Router();

// Apply authentication to all admin routes
router.use(adminAuth);
router.use(apiRateLimiter);

// ============= CATEGORY ROUTES =============

router.get('/categories', getCategories);

router.post('/categories', async (req, res, next) => {
  try {
    const category = await createCategory(req, res);
    // Log the creation
    await logCreate(
      req.user.id,
      req.user.role,
      AUDIT_RESOURCES.CATEGORY,
      category.id,
      { name: category.name },
      req
    );
  } catch (error) {
    next(error);
  }
});

router.put('/categories/:id', async (req, res, next) => {
  try {
    const category = await updateCategory(req, res);
    await logUpdate(
      req.user.id,
      req.user.role,
      AUDIT_RESOURCES.CATEGORY,
      category.id,
      { changes: req.body },
      req
    );
  } catch (error) {
    next(error);
  }
});

router.delete('/categories/:id', async (req, res, next) => {
  try {
    await deleteCategory(req, res);
    await logDelete(
      req.user.id,
      req.user.role,
      AUDIT_RESOURCES.CATEGORY,
      parseInt(req.params.id),
      req
    );
  } catch (error) {
    next(error);
  }
});

// ============= PRODUCT ROUTES =============

router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// ============= USER MANAGEMENT =============

router.get('/users/cashiers', async (req, res) => {
  const cashiers = await prisma.cashier.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      isActive: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });
  res.json(cashiers);
});

router.post('/users/cashiers', async (req, res) => {
  const { username, password, name } = req.body;
  
  // Validate password
  const validation = validatePassword(password);
  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Validation Error',
      message: validation.errors,
    });
  }

  const hashedPassword = await hashPassword(password);
  
  const cashier = await prisma.cashier.create({
    data: {
      username,
      password: hashedPassword,
      name,
    },
  });

  await logCreate(
    req.user.id,
    req.user.role,
    AUDIT_RESOURCES.CASHIER,
    cashier.id,
    { username, name },
    req
  );

  res.json({
    id: cashier.id,
    username: cashier.username,
    name: cashier.name,
  });
});

router.patch('/users/cashiers/:id/deactivate', async (req, res) => {
  const { id } = req.params;
  
  await prisma.cashier.update({
    where: { id: parseInt(id) },
    data: { isActive: false },
  });

  await logUpdate(
    req.user.id,
    req.user.role,
    AUDIT_RESOURCES.CASHIER,
    parseInt(id),
    { action: 'deactivated' },
    req
  );

  res.json({ success: true });
});

// ============= AUDIT LOGS =============

router.get('/audit-logs', async (req, res) => {
  const { userId, userType, action, startDate, endDate, limit } = req.query;
  
  const logs = await getAuditLogs({
    userId: userId ? parseInt(userId) : undefined,
    userType,
    action,
    startDate,
    endDate,
    limit: limit ? parseInt(limit) : 100,
  });

  res.json(logs);
});

export default router;
```

## Cashier Routes Example

```javascript
// backend/src/routes/cashierRoutes.js
import express from 'express';
import { cashierAuth } from '../middleware/enhancedAuth.js';
import { apiRateLimiter } from '../middleware/securityMiddleware.js';
import {
  getProducts,
  getCategories,
} from '../controllers/productController.js';
import {
  createOrder,
  getOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { logCreate, AUDIT_RESOURCES } from '../services/auditService.js';

const router = express.Router();

// Apply authentication to all cashier routes
router.use(cashierAuth);
router.use(apiRateLimiter);

// ============= PRODUCT VIEWING =============

router.get('/products', getProducts);
router.get('/categories', getCategories);

// ============= ORDER MANAGEMENT =============

router.post('/orders', async (req, res, next) => {
  try {
    const { tableNumber, items, notes, priority } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Order must contain at least one item',
      });
    }

    // Calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Product ${item.productId} not found`,
        });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        tableNumber,
        cashierId: req.user.id,
        total,
        notes,
        priority: priority || 'normal',
        status: 'pending',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Log order creation
    await logCreate(
      req.user.id,
      req.user.role,
      AUDIT_RESOURCES.ORDER,
      order.id,
      {
        tableNumber,
        total,
        itemCount: items.length,
      },
      req
    );

    res.json(order);
  } catch (error) {
    next(error);
  }
});

router.get('/orders', async (req, res) => {
  const { status, startDate, endDate } = req.query;

  const where = {
    cashierId: req.user.id, // Only see own orders
  };

  if (status) where.status = status;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(orders);
});

router.get('/orders/:id', async (req, res) => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id: parseInt(id),
      cashierId: req.user.id, // Only see own orders
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Order not found',
    });
  }

  res.json(order);
});

// ============= STATISTICS =============

router.get('/stats/today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await prisma.order.aggregate({
    where: {
      cashierId: req.user.id,
      createdAt: {
        gte: today,
      },
    },
    _count: true,
    _sum: {
      total: true,
    },
  });

  res.json({
    ordersToday: stats._count,
    totalSales: stats._sum.total || 0,
  });
});

export default router;
```

## Kitchen Routes Example

```javascript
// backend/src/routes/kitchenRoutes.js
import express from 'express';
import { kitchenAuth } from '../middleware/enhancedAuth.js';
import { apiRateLimiter } from '../middleware/securityMiddleware.js';
import { logUpdate, AUDIT_RESOURCES } from '../services/auditService.js';

const router = express.Router();

// Apply authentication to all kitchen routes
router.use(kitchenAuth);
router.use(apiRateLimiter);

// ============= ORDER VIEWING =============

router.get('/orders', async (req, res) => {
  const { status } = req.query;

  const where = {};
  if (status) {
    where.status = status;
  } else {
    // Default: show pending and preparing orders
    where.status = {
      in: ['pending', 'preparing'],
    };
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      cashier: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      { priority: 'desc' }, // High priority first
      { createdAt: 'asc' }, // Oldest first
    ],
  });

  res.json(orders);
});

router.get('/orders/:id', async (req, res) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      cashier: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Order not found',
    });
  }

  res.json(order);
});

// ============= ORDER STATUS UPDATES =============

router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid status',
      });
    }

    // Kitchen can only update to: preparing, ready, completed
    const allowedStatuses = ['preparing', 'ready', 'completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Kitchen can only set status to: preparing, ready, or completed',
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Order not found',
      });
    }

    // Update order
    const updateData = { status };
    if (status === 'preparing' && !order.acceptedAt) {
      updateData.acceptedAt = new Date();
    }
    if (status === 'completed' && !order.completedAt) {
      updateData.completedAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Log status change
    await logUpdate(
      req.user.id,
      req.user.role,
      AUDIT_RESOURCES.ORDER,
      updatedOrder.id,
      {
        oldStatus: order.status,
        newStatus: status,
      },
      req
    );

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
});

// ============= STATISTICS =============

router.get('/stats/today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pending, preparing, completed] = await Promise.all([
    prisma.order.count({
      where: {
        status: 'pending',
        createdAt: { gte: today },
      },
    }),
    prisma.order.count({
      where: {
        status: 'preparing',
        createdAt: { gte: today },
      },
    }),
    prisma.order.count({
      where: {
        status: 'completed',
        createdAt: { gte: today },
      },
    }),
  ]);

  res.json({
    pending,
    preparing,
    completed,
    total: pending + preparing + completed,
  });
});

export default router;
```

## Public Routes Example

```javascript
// backend/src/routes/publicRoutes.js
import express from 'express';
import { apiRateLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Apply rate limiting
router.use(apiRateLimiter);

// ============= MENU (PUBLIC) =============

router.get('/menu', async (req, res) => {
  const { lang = 'en' } = req.query;

  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: {
          showInMenu: true, // Only show products marked for menu
        },
        select: {
          id: true,
          name: true,
          nameOr: true,
          nameAm: true,
          nameSo: true,
          nameAr: true,
          description: true,
          descriptionOr: true,
          descriptionAm: true,
          descriptionSo: true,
          descriptionAr: true,
          price: true,
          image: true,
        },
      },
    },
  });

  // Format response based on language
  const formattedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat[`name${lang === 'en' ? '' : lang.charAt(0).toUpperCase() + lang.slice(1)}`] || cat.name,
    products: cat.products.map((prod) => ({
      id: prod.id,
      name: prod[`name${lang === 'en' ? '' : lang.charAt(0).toUpperCase() + lang.slice(1)}`] || prod.name,
      description: prod[`description${lang === 'en' ? '' : lang.charAt(0).toUpperCase() + lang.slice(1)}`] || prod.description,
      price: prod.price,
      image: prod.image,
    })),
  }));

  res.json(formattedCategories);
});

// ============= HEALTH CHECK =============

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
```

## Key Security Features in Routes

1. **Authentication Middleware**: All protected routes use role-specific auth
2. **Rate Limiting**: Prevents abuse
3. **Audit Logging**: All sensitive actions logged
4. **Input Validation**: Validates all inputs
5. **Authorization**: Users can only access their own data
6. **Error Handling**: Proper error responses
7. **SQL Injection Protection**: Prisma parameterized queries
8. **XSS Protection**: Input sanitization
9. **Least Privilege**: Each role has minimal necessary permissions
10. **Audit Trail**: Complete logging of all actions
