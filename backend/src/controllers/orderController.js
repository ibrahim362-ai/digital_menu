import prisma from '../config/database.js';

export const createOrder = async (req, res) => {
  try {
    console.log('=== CREATE ORDER DEBUG ===');
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);
    
    let { tableNumber, items, notes, priority } = req.body;

    // Convert items object to array if needed
    if (items && typeof items === 'object' && !Array.isArray(items)) {
      items = Object.values(items);
    }

    console.log('tableNumber:', tableNumber);
    console.log('items (converted):', items);

    if (!tableNumber || !items || items.length === 0) {
      return res.status(400).json({ error: 'Table number and items are required' });
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('total:', total);

    const order = await prisma.order.create({
      data: {
        tableNumber,
        total,
        notes: notes || null,
        priority: priority || 'normal',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    console.log('Order created successfully:', order.id);
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = { status };
    
    // Track when order is accepted
    if (status === 'preparing') {
      updateData.acceptedAt = new Date();
    }
    
    // Track when order is completed
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const updateOrderPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const validPriorities = ['low', 'normal', 'high'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority' });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { priority },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Update order priority error:', error);
    res.status(500).json({ error: 'Failed to update order priority' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const [pending, preparing, ready, completed, cancelled, total] = await Promise.all([
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'preparing' } }),
      prisma.order.count({ where: { status: 'ready' } }),
      prisma.order.count({ where: { status: 'completed' } }),
      prisma.order.count({ where: { status: 'cancelled' } }),
      prisma.order.count()
    ]);

    const totalRevenue = await prisma.order.aggregate({
      where: { status: { in: ['completed'] } },
      _sum: { total: true }
    });

    res.json({
      pending,
      preparing,
      ready,
      completed,
      cancelled,
      total,
      revenue: totalRevenue._sum.total || 0
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: 'Failed to fetch order stats' });
  }
};
