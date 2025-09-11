const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const {
  customerCreateSchema,
  customerUpdateSchema,
  customerIdSchema,
} = require('../validators/customerValidator');

// Mock data for now (replace with actual database operations)
let customers = [];
let orders = []; // Mock orders data
let nextId = 1;

/**
 * POST /customers - Create a new customer
 */
router.post('/', validate({ body: customerCreateSchema }), (req, res) => {
  try {
    const customer = {
      id: nextId++,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    customers.push(customer);

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message,
    });
  }
});

/**
 * GET /customers - List all customers
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customers,
      count: customers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers',
      error: error.message,
    });
  }
});

/**
 * GET /customers/:id - Get single customer
 */
router.get('/:id', validate({ params: customerIdSchema }), (req, res) => {
  try {
    const customer = customers.find((c) => c.id === parseInt(req.params.id));

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      message: 'Customer retrieved successfully',
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer',
      error: error.message,
    });
  }
});

/**
 * PUT /customers/:id - Update customer
 */
router.put(
  '/:id',
  validate({
    params: customerIdSchema,
    body: customerUpdateSchema,
  }),
  (req, res) => {
    try {
      const customerIndex = customers.findIndex(
        (c) => c.id === parseInt(req.params.id)
      );

      if (customerIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      customers[customerIndex] = {
        ...customers[customerIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customers[customerIndex],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update customer',
        error: error.message,
      });
    }
  }
);

/**
 * DELETE /customers/:id - Delete customer
 */
router.delete('/:id', validate({ params: customerIdSchema }), (req, res) => {
  try {
    const customerIndex = customers.findIndex(
      (c) => c.id === parseInt(req.params.id)
    );

    if (customerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    const deletedCustomer = customers.splice(customerIndex, 1)[0];

    res.json({
      success: true,
      message: 'Customer deleted successfully',
      data: deletedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error.message,
    });
  }
});

/**
 * GET /customers/:id/orders - Get orders of one customer
 */
router.get(
  '/:id/orders',
  validate({ params: customerIdSchema }),
  (req, res) => {
    try {
      const customerId = parseInt(req.params.id);

      // Check if customer exists
      const customer = customers.find((c) => c.id === customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      // Filter orders for this customer
      const customerOrders = orders.filter(
        (o) => o.customerId === customerId.toString()
      );

      res.json({
        success: true,
        message: 'Customer orders retrieved successfully',
        data: customerOrders,
        count: customerOrders.length,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customer orders',
        error: error.message,
      });
    }
  }
);

module.exports = router;
