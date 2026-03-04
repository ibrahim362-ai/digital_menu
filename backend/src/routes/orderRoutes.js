import express from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrderById,
  updateOrderStatus, 
  updateOrderPriority,
  deleteOrder,
  getOrderStats
} from '../controllers/orderController.js';
import { flexibleAuth } from '../middleware/flexibleAuth.js';

const router = express.Router();

router.post('/', flexibleAuth, createOrder);
router.get('/', flexibleAuth, getOrders);
router.get('/stats', flexibleAuth, getOrderStats);
router.get('/:id', flexibleAuth, getOrderById);
router.patch('/:id/status', flexibleAuth, updateOrderStatus);
router.patch('/:id/priority', flexibleAuth, updateOrderPriority);
router.delete('/:id', flexibleAuth, deleteOrder);

export default router;
