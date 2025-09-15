const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { ensureAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { orderValidator } = require('../validators');

// Apply authentication to all routes
router.use(ensureAuth);

// @desc    Create order
// @route   POST /api/orders
router.post(
  '/',
  validate({ body: orderValidator.orderCreateSchema }),
  orderController.createOrder
);

// @desc    Get all orders
// @route   GET /api/orders
router.get('/', orderController.getAllOrders);

// @desc    Get order by ID
// @route   GET /api/orders/:id
router.get(
  '/:id',
  validate({ params: orderValidator.orderIdSchema }),
  orderController.getOrderById
);

// @desc    Update order
// @route   PUT /api/orders/:id
router.put(
  '/:id',
  validate({
    params: orderValidator.orderIdSchema,
    body: orderValidator.orderUpdateSchema,
  }),
  orderController.updateOrder
);

// @desc    Delete order
// @route   DELETE /api/orders/:id
router.delete(
  '/:id',
  validate({ params: orderValidator.orderIdSchema }),
  orderController.deleteOrder
);

// @desc    Get orders by customer
// @route   GET /api/orders/customer/:customerId
router.get('/customer/:customerId', orderController.getOrdersByCustomer);

// @desc    Bulk create orders
// @route   POST /api/orders/bulk
router.post('/bulk', orderController.bulkCreateOrders);

module.exports = router;
