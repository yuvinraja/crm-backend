const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const {
  orderCreateSchema,
  orderUpdateSchema,
  orderIdSchema,
} = require('../validators/orderValidator');
const { customerIdSchema } = require('../validators/customerValidator');

// Mock data for now (replace with actual database operations)
let orders = [];
let nextId = 1;

/**
 * POST /orders - Create a new order
 */
router.post('/', validate({ body: orderCreateSchema }), (req, res) => {
  try {
    const order = {
      id: nextId++,
      ...req.body,
      orderDate: req.body.orderDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.push(order);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

/**
 * GET /orders - List all orders
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  }
});

/**
 * GET /orders/:id - Get order by id
 */
router.get('/:id', validate({ params: orderIdSchema }), (req, res) => {
  try {
    const order = orders.find((o) => o.id === parseInt(req.params.id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message,
    });
  }
});

module.exports = router;
